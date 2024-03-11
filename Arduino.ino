#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <PubSubClient.h>

// Define your WiFi credentials
#define WIFI_SSID "ESP32"
#define WIFI_PASSWORD "88888888"

// LINE Notify token
#define LINE_TOKEN_PIR "yl2nkti2G77vpG4YEweemiKUP2PkvcwR66AHKySUao2"

#define tracker 34
#define RGB_MODULE_RED_PIN 16
#define RGB_MODULE_GREEN_PIN 17
#define RGB_MODULE_BLUE_PIN 26
#define BUZZER_PIN 19
#define led 5

const int BLUE[] = { 0, 0, 255 };
const int RED[] = { 255, 0, 0 };
const int GREEN[] = { 0, 255, 0 };

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

String message1 = "%E0%B8%A1%E0%B8%B5%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%81!";
uint32_t time1, time2;
int threshold = 500;

const char* mqttServer = "mqtt.netpie.io";
const int mqttPort = 1883;
const char* clientID = "c1b40ba4-ffcd-4c20-aea0-56bb155144f8";
const char* mqttUser = "KNj5zck4h8WASo8xaJuF56mrgqmDXWMf";
const char* mqttPassword = "GBT5f1pByLvkSopqquo8HsyqdtVQPL8G";
const char* topic_pub = "@shadow/data/update";
const char* topic_sub = "@msg/lab_ict_kps/command";

String publishMessage;

int open_status = 0;

WiFiClient espClient;

PubSubClient client(espClient);

void setColor(const int color[]) {
  analogWrite(RGB_MODULE_RED_PIN, color[0]);
  analogWrite(RGB_MODULE_GREEN_PIN, color[1]);
  analogWrite(RGB_MODULE_BLUE_PIN, color[2]);
}

void setup_wifi() {
  delay(10);
  Serial.println("Connecting to WiFi");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Connected to WiFi, IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnectMQTT() {
  char mqttinfo[80];
  snprintf(mqttinfo, 75, "Attempting MQTT connection at %s:%d (%s/%s)...", mqttServer, mqttPort, mqttUser, mqttPassword);
  while (!client.connected()) {
    Serial.println(mqttinfo);
    String clientId = clientID;
    if (client.connect(clientId.c_str(), mqttUser, mqttPassword)) {
      Serial.println("...Connected");
      client.subscribe(topic_sub);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void messageReceivedCallback(char* topic, byte* payload, unsigned int length) {
  char payloadMsg[80];

  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message:");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    payloadMsg[i] = (char)payload[i];
  }
  payloadMsg[length] = '\0';  // put end of string to buffer
  Serial.println();
  Serial.println("-----------------------");
  processMessage(payloadMsg);
  Serial.println(payloadMsg);
}

void processMessage(String recvCommand) {

  if (recvCommand == "OPEN") {
    open_status = 1;
  } else if (recvCommand == "CLOSE") {
    open_status = 0;
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println();

  pinMode(tracker, INPUT);
  pinMode(RGB_MODULE_RED_PIN, OUTPUT);
  pinMode(RGB_MODULE_GREEN_PIN, OUTPUT);
  pinMode(RGB_MODULE_BLUE_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(led, OUTPUT);

  setColor(BLUE);
  digitalWrite(BUZZER_PIN, LOW);

  Serial.println("Connecting to WiFi");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Connected to WiFi, IP address: ");
  Serial.println(WiFi.localIP());

  timeClient.begin();
  timeClient.setTimeOffset(7 * 3600);

  delay(2000);
  Serial.println("PIR Ready!!");
  time1 = time2 = millis();

  setup_wifi();
  client.setServer(mqttServer, mqttPort);
  client.setCallback(messageReceivedCallback);
}

void loop() {
  unsigned long currentMillis = millis();

  if (WiFi.status() == WL_CONNECTED) {
    setColor(RED);
  } else {
    setColor(BLUE);
  }

    int val = digitalRead(tracker);
    Serial.println(val);

  if (val == LOW) {
    if (currentMillis - time1 >= 1000) {
      time1 = currentMillis;

      Serial.println("Move Detect !");
      setColor(GREEN);
      digitalWrite(BUZZER_PIN, HIGH);
      delay(500);
      digitalWrite(BUZZER_PIN, LOW);
      digitalWrite(BUZZER_PIN, HIGH);
      delay(500);
      digitalWrite(BUZZER_PIN, LOW);
      digitalWrite(BUZZER_PIN, HIGH);
      delay(500);
      digitalWrite(BUZZER_PIN, LOW);

      timeClient.update();
      String currentTime = timeClient.getFormattedTime();

      publishMessage = "{\"data\": {\"MoveDetect\": 1, \"timestamp\": \"" + currentTime + "\"}}";
      Serial.println(publishMessage);

      client.publish(topic_pub, publishMessage.c_str());

      Line_Notify1(message1);
    }
  } else {
    publishMessage = "{\"data\": {\"MoveDetect\": 0}}";
  }

  if (currentMillis - time2 >= 500) {
    time2 = currentMillis;
    client.publish(topic_pub, publishMessage.c_str());
  }
  if (open_status == 1) {
    digitalWrite(led, HIGH);
    digitalWrite(BUZZER_PIN, HIGH);
    delay(200);
  } else if (open_status == 0) {
    digitalWrite(led, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    delay(200);
  }

  timeClient.update();
  delay(10);

  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();
}

void Line_Notify1(String message) {
  WiFiClientSecure client;
  client.setInsecure();

  if (!client.connect("notify-api.line.me", 443)) {
    Serial.println("Connection failed");
    delay(2000);
    return;
  }

  String req = "";
  req += "POST /api/notify HTTP/1.1\r\n";
  req += "Host: notify-api.line.me\r\n";
  req += "Authorization: Bearer " + String(LINE_TOKEN_PIR) + "\r\n";
  req += "Cache-Control: no-cache\r\n";
  req += "User-Agent: ESP8266\r\n";
  req += "Content-Type: application/x-www-form-urlencoded\r\n";
  req += "Content-Length: " + String(String("message=" + message + " - " + timeClient.getFormattedTime()).length()) + "\r\n";
  req += "\r\n";
  req += "message=" + message + " - " + timeClient.getFormattedTime();
  client.print(req);

  delay(20);

  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") {
      break;
    }
  }
}