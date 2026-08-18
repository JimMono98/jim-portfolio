# Deterministic AI reconstruction

This toolchain rebuilds the documented April 2024 experiments with a fixed seed,
exports fitted scikit-learn parameters for dependency-free browser inference, and
checks JavaScript predictions against scikit-learn reference results.

The generated data is a portfolio reconstruction. It is not the original,
unseeded coursework run and its metrics must never be presented as original
coursework scores.

Use a disposable Python 3.12 environment outside the repository:

```bash
python3.12 -m venv /tmp/jimmono-ai-reconstruction
/tmp/jimmono-ai-reconstruction/bin/pip install \
  -r scripts/ai-reconstruction/requirements.txt
/tmp/jimmono-ai-reconstruction/bin/python \
  scripts/ai-reconstruction/generate_fixture.py --check
node scripts/ai-reconstruction/verify_parity.mjs
```

Run the generator without `--check` only when intentionally regenerating the
fixture after reviewing a reconstruction change.
