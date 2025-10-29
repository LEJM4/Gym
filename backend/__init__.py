# backend/__init__.py

from flask import Flask

class GymApp:
    """
    Hauptklasse für die Flask-Anwendung.
    Sie erstellt die App, lädt Konfigurationen und registriert Routen.
    """

    def __init__(self):
        # Initialisierungsmethode der Klasse (wird beim Erstellen aufgerufen)
        self.app = Flask(__name__, static_folder="../", static_url_path="/")
        self.configure_app()   # Aufruf einer Methode zur Konfiguration
        self.register_routes() # Aufruf einer Methode zum Registrieren der Routen

    def configure_app(self):
        """
        Hier könnten Konfigurationen stehen, z. B. für Debug, Datenbank, etc.
        Aktuell aktivieren wir einfach Debug-Modus.
        """
        self.app.config["DEBUG"] = True

    def register_routes(self):
        """
        Importiert und registriert alle Blueprints (also Routen-Module).
        So bleibt die App modular und übersichtlich.
        """
        from backend.routes.kontakt import kontakt_bp
        self.app.register_blueprint(kontakt_bp)

    def run(self):
        """
        Startet den Flask-Server.
        Diese Methode wird in app.py aufgerufen.
        """
        self.app.run(debug=self.app.config["DEBUG"])
