"""
NEXUS — Supply Chain Intelligence Platform Launcher
Runs both FastAPI backend and Next.js frontend simultaneously in a single terminal.
Bypasses Windows execution policy and SmartScreen blocks on .bat / .ps1 files.
"""
import os
import sys
import subprocess
import signal
import time

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

def find_python():
    # Prefer venv python if available
    venv_python_win = os.path.join(BACKEND_DIR, "venv", "Scripts", "python.exe")
    venv_python_unix = os.path.join(BACKEND_DIR, "venv", "bin", "python")
    if os.path.exists(venv_python_win):
        return venv_python_win
    if os.path.exists(venv_python_unix):
        return venv_python_unix
    return sys.executable

def main():
    print("=" * 60)
    print("   NEXUS - Supply Chain Disruption Predictor Platform    ")
    print("=" * 60)

    py_exe = find_python()
    print(f"[*] Using Python: {py_exe}")

    # Ensure frontend dependencies are installed
    node_modules = os.path.join(FRONTEND_DIR, "node_modules")
    if not os.path.exists(node_modules):
        print("[*] Installing frontend dependencies (npm install)...")
        subprocess.run("npm install", cwd=FRONTEND_DIR, shell=True, check=True)

    # 1. Launch FastAPI Backend
    print("[1/2] Starting FastAPI Backend on http://127.0.0.1:8000...")
    backend_cmd = [
        py_exe,
        "-m", "uvicorn",
        "main:app",
        "--app-dir", "backend",
        "--host", "127.0.0.1",
        "--port", "8000",
        "--reload"
    ]
    backend_proc = subprocess.Popen(backend_cmd, cwd=ROOT_DIR)

    # Short pause to let backend bind port
    time.sleep(1)

    # 2. Launch Next.js Frontend
    print("[2/2] Starting Next.js Frontend on http://localhost:3000...")
    frontend_cmd = "npm run dev -- -p 3000"
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=FRONTEND_DIR, shell=True)

    print("\n" + "=" * 60)
    print("   NEXUS is RUNNING!")
    print("   -> Dashboard: http://localhost:3000")
    print("   -> API Docs:  http://127.0.0.1:8000/docs")
    print("   Press Ctrl+C to stop both servers.")
    print("=" * 60 + "\n")

    def shutdown(sig, frame):
        print("\n[*] Shutting down NEXUS servers...")
        try:
            frontend_proc.terminate()
            backend_proc.terminate()
        except Exception:
            pass
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        # Wait for either process to exit
        while True:
            if backend_proc.poll() is not None:
                print("[!] Backend exited.")
                break
            if frontend_proc.poll() is not None:
                print("[!] Frontend exited.")
                break
            time.sleep(1)
    except KeyboardInterrupt:
        shutdown(None, None)

if __name__ == "__main__":
    main()
