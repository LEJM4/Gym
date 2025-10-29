# backend/routes/kontakt.py

from flask import Blueprint, jsonify, request

# Blueprint erstellen (Name, Modulname)
kontakt_bp = Blueprint("kontakt", __name__)

class KontaktAPI:
    """
    Eine Klasse, die die Logik für das Kontaktformular kapselt.
    Hier könnte man später z. B. E-Mail-Versand oder Datenbankspeicherung einbauen.
    """

    @staticmethod
    @kontakt_bp.route("/api/kontakt", methods=["POST"])
    def empfange_nachricht():
        """
        Diese Methode empfängt eine POST-Anfrage vom Frontend.
        Erwartet JSON-Daten mit 'name' und 'nachricht'.
        Gibt eine JSON-Antwort zurück.
        """
        data = request.json  # JSON-Daten vom Frontend lesen
        print("📩 Neue Nachricht empfangen:", data)

        # Beispielhafte Antwort
        return jsonify({
            "status": "ok",
            "message": f"Danke {data.get('name', 'Unbekannt')}! Deine Nachricht wurde empfangen."
        })
