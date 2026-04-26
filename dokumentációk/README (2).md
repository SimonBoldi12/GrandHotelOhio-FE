
Grand Hotel Ohio weboldala

Készítette:

Béres Nándor

Simon Boldizsár

Vincze Áron Zoltán

NYÍREGYHÁZA

2026

---

- Az elkészült munka megtekintéséhez szükséges a **Docker** letöltése és telepítése.
  Látogassunk el a következő oldalra: <https://www.docker.com/>, és onnan töltsük le az
  operációs rendszerünknek megfelelő Docker-verziót.

- Telepítsük fel. A letöltött futtatható állományt indítsuk el, és
  kövessük a képernyőn megjelenő utasításokat.

- Nyissuk meg az **IntelliJ IDEA** alkalmazást, és kössük össze a **Git**-tel.
  (VCS menu → Enable Version Control Integration, majd adjuk meg a repository URL-jét)

- Az IntelliJ beépített konzolában indítsuk el az adatbázist a következő paranccsal:

  ```
  docker compose up -d
  ```

- Ezután indítsuk el a **Backend**-et IntelliJ-ben (futtassuk a főalkalmazás osztályt).

- Indítsunk egy **Visual Studio Code** alkalmazást, és nyissuk meg benne a `frontend` mappát
  az Open Folder menüponttal. Kössük össze szintén a **Git**-tel.

- Nyissunk egy Terminált a Terminal menu / New Terminal-lal, és telepítsük a modulokat:

  ```
  npm -i
  ```

- Az alkalmazás indításához futtassuk a következő parancsot:

  ```
  npm run dev
  ```

- Ezután a <http://localhost:5173> címen lehet elérni az alkalmazást.
