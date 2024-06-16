var port = null;

function changeColor(newColor) {
  const elem = document.getElementById("para");
  elem.style.color = newColor;
}

async function do_connect() {
// Prompt user to select any serial port.
console.log("connexion");
  if (port == null)  {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    button_connexion.className = "vert";
  }
  else {
    port.close();
    port = null;
    button_connexion.className = "rouge";
  }
}

function lit_serie(reader) {
  reader = port.readable.getReader();
  while (true) {
    // attend la reponse
    const {value, done} = reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
  }
  return value;
}

function formatte(chaine) {
  let tension = parseInt(chaine) * 5 / 1023;
  tension = tension.toPrecision(3);
  return `valeur lue : ${chaine}; Tension mesurée : ${tension} V`;
}
 
async function do_envoi(message) {
  // envoi Hello sur le liaison serie lorsqu'on clique sur le bouton envoi
  resultat = document.getElementById("id_resultat")
  if (port != null) {
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode(message));
    await writer.releaseLock();
    //lecture de la reponse
    const textDecoder = new TextDecoder();
    const reader = port.readable.getReader();
    chaine = ""; 
    ok = true;
    while (ok) {
      const {value, done } = await reader.read();
      ch = textDecoder.decode(value);
      if (ch.includes("\n")) {
        // Allow the serial port to be closed later.
        await reader.releaseLock();
        ok =false;
      }
      chaine = chaine + ch;
      resultat.innerHTML = formatte(chaine);
    }
  }
  else {
    console.log("Non connecté");
    resultat.innerHTML = "Non connecté";
  }
}

// ------ programme principal ------

if ("serial" in navigator) {
  // The Web Serial API is supported.
  var button_connexion = document.getElementById("id_button_connexion");
  var button_mesure = document.getElementById("id_button_mesure");

  //console.log(button_connexion);
  button_connexion.addEventListener('click', async => do_connect());
  button_mesure.addEventListener('click', async => do_envoi("mesure"));
}
else {
  alert("Pas de Web Serial dans le navigateur");
}

