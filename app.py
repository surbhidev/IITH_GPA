from flask import Flask, redirect, url_for, session, render_template
from flask_dance.contrib.google import make_google_blueprint, google
import os
from dotenv import load_dotenv # type: ignore


load_dotenv("secret.env")

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "default-fallback-secret")

google_bp = make_google_blueprint(
    client_id=os.environ.get("GOOGLE_CLIENT_ID"),
    client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
    redirect_url=os.environ.get("GOOGLE_REDIRECT_URI", "http://localhost:5000/login/google/authorized"),
    scope=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid"
    ]
)
app.register_blueprint(google_bp, url_prefix="/login")

@app.route("/")
def index():
    if not google.authorized:
        return redirect(url_for("google.login"))
    
    resp = google.get("/oauth2/v2/userinfo")
    assert resp.ok, resp.text
    user_info = resp.json()
    
    email = user_info["email"]
    
    # Only allow iith.ac.in emails
    if not email.endswith("@iith.ac.in"):
        return "Access denied: only iith.ac.in emails allowed."
    
    return render_template("calculator.html", email=email)

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

