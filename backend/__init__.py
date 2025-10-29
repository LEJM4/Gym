# backend/__init__.py
import os
from flask import Flask, send_from_directory

class GymApp:
    """
    Hauptklasse für die Flask-Anwendung.
    Sie erstellt die App, lädt Konfigurationen und registriert Routen.
    """

    def __init__(self):
        # === Basisverzeichnis des Projekts (eine Ebene über "backend") ===
        self.BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        # -> Beispiel: C:/Paris_leo/GitHub/Gym

        # === Flask-App initialisieren ===
        self.app = Flask(
            __name__,
            static_folder=os.path.join(self.BASE_DIR, ""),  # Frontend-Ordner
            static_url_path="/"                             # sorgt dafür, dass URLs wie /index.html funktionieren
        )

        # === App konfigurieren & Routen laden ===
        self.configure_app()
        self.register_routes()
        self.create_base_routes()  # <-- NEU: Routinen für Startseite & Fallback hinzufügen

    def configure_app(self):
        """
        Hier werden Konfigurationen gesetzt, z. B. Debug-Modus oder Datenbankpfade.
        """
        self.app.config["DEBUG"] = True

    def register_routes(self):
        """
        Importiert und registriert alle Blueprints (z. B. Kontaktformular, Mitgliederverwaltung usw.)
        Blueprints sind kleine Module mit eigenen Routen, die wir an die App „anhängen“.
        """
        from backend.routes.kontakt import kontakt_bp
        self.app.register_blueprint(kontakt_bp)

    def create_base_routes(self):
        """
        Erstellt Standardrouten:
        - /  → index.html
        - /partials/...  → lädt HTML-Komponenten
        - /assets/...    → liefert CSS, JS, Bilder usw.
        - 404-Fallback   → index.html
        """

        @self.app.route("/")
        def index():
            return send_from_directory(self.BASE_DIR, "index.html")

        # === NEU: Route für Partials (HTML-Komponenten) ===
        @self.app.route("/partials/<path:filename>")
        def serve_partials(filename):
            return send_from_directory(os.path.join(self.BASE_DIR, "partials"), filename)

        # === NEU: Route für Assets (CSS, JS, Bilder) ===
        @self.app.route("/assets/<path:filename>")
        def serve_assets(filename):
            return send_from_directory(os.path.join(self.BASE_DIR, "assets"), filename)

        @self.app.errorhandler(404)
        def not_found(e):
            return send_from_directory(self.BASE_DIR, "index.html")
        
    def run(self):
        """
        Startet den Flask-Server.
        Wird in backend/app.py aufgerufen.
        """
        self.app.run(debug=self.app.config["DEBUG"])
