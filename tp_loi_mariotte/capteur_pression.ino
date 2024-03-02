/* mesures de pression par réception de commandes envoyées par la bibiothèque pduino.py 
 * montage: capteur pression grove sur A0
 * ref sur 5,0V
 * commande acceptée: mesure
 * à la réception de la commande "mesure", le programme envoie la valeur numérique (entre 0 et 1023)
 * de A0 sur la liaison série
 */
int pin_capteur_pression;

void setup() {
  Serial.begin(9600);
  pin_capteur_pression = A0;
  delay(1);
}

void loop() {
  if (Serial.available()) {
    if (Serial.readString() == "mesure") {
       int value = analogRead(pin_capteur_pression);
       Serial.println(value);         
    }
  }     
}
