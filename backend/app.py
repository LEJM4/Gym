# backend/app.py

from backend import GymApp  # Importiert unsere Klasse aus __init__.py

# Hauptprogramm starten
if __name__ == "__main__":
    """
    Hier wird die GymApp-Klasse instanziiert und gestartet.
    Das __name__ == "__main__" sorgt dafür,
    dass der Server nur startet, wenn die Datei direkt ausgeführt wird.
    """
    app_instance = GymApp()  # Erstellt eine Instanz unserer App-Klasse
    app_instance.run()       # Startet den Server
