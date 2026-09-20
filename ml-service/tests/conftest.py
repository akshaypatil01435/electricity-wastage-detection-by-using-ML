import os
import sys
import tempfile
from pathlib import Path

# Isolate model files and disable API key for most tests
os.environ["MODEL_DIR"] = tempfile.mkdtemp(prefix="wv-models-")
os.environ.pop("ML_API_KEY", None)
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
