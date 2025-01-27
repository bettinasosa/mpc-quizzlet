import subprocess
from pathlib import Path

def build_contract():
    """Build the ZK contract for deployment"""
    print("Building contract...")
    
    # Navigate to contract directory
    contract_dir = Path("../rust/zk-classification")
    
    # Build commands
    commands = [
        "cargo build --release --target wasm32-unknown-unknown",
        # Add any other necessary build steps
    ]
    
    for cmd in commands:
        print(f"Running: {cmd}")
        result = subprocess.run(
            cmd.split(),
            cwd=contract_dir,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            print("Build failed!")
            print(result.stderr)
            return False
            
    print("Build successful!")
    return True

if __name__ == "__main__":
    build_contract() 