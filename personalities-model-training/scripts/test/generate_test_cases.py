import json
import numpy as np
from pathlib import Path

def generate_test_cases():
    """Generate test cases and predict their outcomes using the model."""
    
    # Load the model
    model_path = Path('model/tree.json')
    with open(model_path) as f:
        model = json.load(f)
    
    # Create test cases
    test_cases = [
        np.full(25, 500),  # All mid-range
        np.array([800, 200] * 12 + [800]),  # Alternating high/low
        np.full(25, 900),  # All high
    ]
    
    # Save test cases
    output = {
        'test_cases': [case.tolist() for case in test_cases]
    }
    
    output_path = Path('data/test_cases.json')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)
    
    print("Generated test cases:")
    for i, case in enumerate(test_cases):
        print(f"\nTest case {i + 1}:")
        print(f"Min value: {case.min()}")
        print(f"Max value: {case.max()}")
        print(f"Mean value: {case.mean():.2f}")

if __name__ == "__main__":
    generate_test_cases() 