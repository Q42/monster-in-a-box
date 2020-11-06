#include <Adafruit_NeoPixel.h>

String received;

#define NUM_LIGHTS 150
#define LIGHTS_PIN 6
#define MIRROR 37 

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LIGHTS, LIGHTS_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  strip.begin();
  strip.show(); // Initialize all pixels to 'off'

//  run("wipe-red");
}

void loop() {
  // send data only when you receive data:
  if (Serial.available() > 0) {
    received = Serial.readStringUntil('\n');
    Serial.print("You sent me: ");
    Serial.println(received);
    run(received);
  }
}

void run(String cmd) {
  if (cmd == "wipe-red") {
    colorWipe(strip.Color(255, 0, 0), 1); // Red
    colorWipe(strip.Color(0, 0, 0), 1); // Off
  }

}

// Fill the dots one after the other with a color
void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, c);
    strip.show();
    delay(wait);
  }
}
