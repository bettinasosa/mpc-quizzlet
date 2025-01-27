import json
from pathlib import Path
from typing import List

class PartisiaContractTester:
    def __init__(self):
        self.contract_address = None
    
    def validate_model(self, model_path: str) -> bool:
        """Validate the model structure"""
        print("Validating model...")
        
        # Load model
        with open(model_path) as f:
            model = json.load(f)
            
        # Basic validation
        if 'internals' not in model or 'leaves' not in model:
            print("Error: Model missing required fields")
            return False
            
        n_internal = len(model['internals'])
        n_leaves = len(model['leaves'])
        
        print(f"Model structure:")
        print(f"- Internal nodes: {n_internal}")
        print(f"- Leaf nodes: {n_leaves}")
        print(f"- Features used: {sorted(set(node['feature'] for node in model['internals']))}")
        
        # Validate tree structure
        if n_leaves != n_internal + 1:
            print("Error: Invalid tree structure")
            return False
            
        return True
    
    def test_classification(self, inputs: List[int]) -> int:
        """Test classification with given inputs"""
        print(f"\nTesting with inputs: {inputs[:5]}...")
        
        # For now, just validate input structure
        if len(inputs) != 25:
            print("Error: Expected 25 inputs")
            return -1
            
        if not all(0 <= x <= 1000 for x in inputs):
            print("Error: All inputs must be between 0 and 1000")
            return -1
        
        return 0  # Placeholder for actual result

def main():
    # Paths
    model_path = Path("model/personality_tree_contract.json")
    
    # Create test inputs
    test_inputs = [
        [500] * 25,  # All mid-range
        [800, 200] * 12 + [800],  # Alternating high/low
        [900] * 25,  # All high
    ]
    
    # Initialize tester
    tester = PartisiaContractTester()
    
    # First validate model
    if not tester.validate_model(str(model_path)):
        print("Model validation failed!")
        return
    
    # Test each input
    for i, inputs in enumerate(test_inputs, 1):
        result = tester.test_classification(inputs)
        print(f"Test case {i} validation: {'passed' if result >= 0 else 'failed'}")

if __name__ == "__main__":
    main() 