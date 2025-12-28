#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define PORT 3000
#define BUFFER_SIZE 4096
#define MAX_HAIKUS 100

typedef struct {
    char text[256];
    char image[128];
} Haiku;

Haiku haikus[MAX_HAIKUS];
int haiku_count = 0;

void load_haikus() {
    FILE *fp = fopen("haikus.json", "r");
    if (!fp) {
        perror("Failed to open haikus.json");
        return;
    }

    char buffer[BUFFER_SIZE];
    fread(buffer, 1, BUFFER_SIZE, fp);
    fclose(fp);

    // Simple JSON parsing (looking for "text" and "image" fields)
    char *ptr = buffer;
    while ((ptr = strstr(ptr, "\"text\":")) != NULL && haiku_count < MAX_HAIKUS) {
        ptr += 8; // skip "text": "
        char *end = strstr(ptr, "\",");
        if (end) {
            int len = end - ptr;
            if (len > 255) len = 255;
            strncpy(haikus[haiku_count].text, ptr, len);
            haikus[haiku_count].text[len] = '\0';

            // Replace \n with actual newlines
            char temp[256];
            char *src = haikus[haiku_count].text;
            char *dst = temp;
            while (*src) {
                if (*src == '\\' && *(src+1) == 'n') {
                    *dst++ = '\n';
                    src += 2;
                } else {
                    *dst++ = *src++;
                }
            }
            *dst = '\0';
            strcpy(haikus[haiku_count].text, temp);
        }

        ptr = strstr(ptr, "\"image\":");
        if (ptr) {
            ptr += 9; // skip "image": "
            char *end = strstr(ptr, "\"");
            if (end) {
                int len = end - ptr;
                if (len > 127) len = 127;
                strncpy(haikus[haiku_count].image, ptr, len);
                haikus[haiku_count].image[len] = '\0';
                haiku_count++;
            }
        }
    }

    printf("Loaded %d haikus\n", haiku_count);
}

void send_response(int client_socket) {
    char response[8192];
    char html[4096] = "";

    // Build HTML
    strcat(html, "<!DOCTYPE html>\n<html>\n<head>\n");
    strcat(html, "<title>Haikus for Codespaces</title>\n");
    strcat(html, "<link rel='stylesheet' href='/css/main.css'>\n");
    strcat(html, "</head>\n<body>\n");
    strcat(html, "<div class='container'>\n");
    strcat(html, "<h1>Haikus for Codespaces</h1>\n");

    for (int i = 0; i < haiku_count; i++) {
        char haiku_html[512];
        snprintf(haiku_html, sizeof(haiku_html),
                 "<div class='haiku'>\n"
                 "<img src='/images/%s' alt='haiku image'>\n"
                 "<pre>%s</pre>\n"
                 "</div>\n",
                 haikus[i].image, haikus[i].text);
        strcat(html, haiku_html);
    }

    strcat(html, "</div>\n</body>\n</html>");

    // Build HTTP response
    snprintf(response, sizeof(response),
             "HTTP/1.1 200 OK\r\n"
             "Content-Type: text/html\r\n"
             "Content-Length: %ld\r\n"
             "Connection: close\r\n"
             "\r\n"
             "%s",
             strlen(html), html);

    send(client_socket, response, strlen(response), 0);
}

void send_file(int client_socket, const char *path) {
    char filepath[256] = "public";
    strcat(filepath, path);

    FILE *fp = fopen(filepath, "rb");
    if (!fp) {
        char response[] = "HTTP/1.1 404 Not Found\r\n\r\n";
        send(client_socket, response, strlen(response), 0);
        return;
    }

    // Determine content type
    char *content_type = "text/plain";
    if (strstr(path, ".css")) content_type = "text/css";
    else if (strstr(path, ".jpg") || strstr(path, ".jpeg")) content_type = "image/jpeg";
    else if (strstr(path, ".png")) content_type = "image/png";

    // Read file
    fseek(fp, 0, SEEK_END);
    long size = ftell(fp);
    fseek(fp, 0, SEEK_SET);

    char *file_content = malloc(size);
    fread(file_content, 1, size, fp);
    fclose(fp);

    // Send response
    char header[512];
    snprintf(header, sizeof(header),
             "HTTP/1.1 200 OK\r\n"
             "Content-Type: %s\r\n"
             "Content-Length: %ld\r\n"
             "Connection: close\r\n"
             "\r\n",
             content_type, size);

    send(client_socket, header, strlen(header), 0);
    send(client_socket, file_content, size, 0);

    free(file_content);
}

void handle_request(int client_socket) {
    char buffer[BUFFER_SIZE];
    int bytes_read = recv(client_socket, buffer, BUFFER_SIZE - 1, 0);

    if (bytes_read <= 0) {
        close(client_socket);
        return;
    }

    buffer[bytes_read] = '\0';

    // Parse request
    char method[16], path[256], protocol[16];
    sscanf(buffer, "%s %s %s", method, path, protocol);

    printf("Request: %s %s\n", method, path);

    if (strcmp(path, "/") == 0) {
        send_response(client_socket);
    } else {
        send_file(client_socket, path);
    }

    close(client_socket);
}

int main() {
    load_haikus();

    int server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket < 0) {
        perror("Socket creation failed");
        exit(1);
    }

    int opt = 1;
    setsockopt(server_socket, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    struct sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    if (bind(server_socket, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("Bind failed");
        exit(1);
    }

    if (listen(server_socket, 10) < 0) {
        perror("Listen failed");
        exit(1);
    }

    printf("Server listening on port %d\n", PORT);

    while (1) {
        struct sockaddr_in client_addr;
        socklen_t client_len = sizeof(client_addr);
        int client_socket = accept(server_socket, (struct sockaddr *)&client_addr, &client_len);

        if (client_socket < 0) {
            perror("Accept failed");
            continue;
        }

        handle_request(client_socket);
    }

    close(server_socket);
    return 0;
}
