import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.metrics import confusion_matrix, classification_report
import random, json
from pathlib import Path
import seaborn as sns
import matplotlib.pyplot as plt

from questions import QUESTIONS  # Our question text & answers

NUM_PERSONALITIES = 8
MAX_DEPTH = 3
MAX_LEAF_NODES = 8
SAMPLES_PER_PERSONALITY = 300

# Example prototypes (adjust as you wish)
PERSONALITY_PROTOTYPES = {
    0: [0,1,0,1,0,1,0,1,0,1],  # HODLer
    1: [3,2,3,0,3,2,3,1,2,3],  # Degen
    2: [1,0,2,0,2,3,2,1,0,2],  # NFT Flipper
    3: [2,1,2,2,1,2,1,2,3,3],  # DeFi Wizard
    4: [1,3,0,0,1,1,1,0,1,2],  # Privacy Maxi
    5: [1,0,2,3,1,2,0,3,2,2],  # Developer
    6: [2,3,2,1,3,2,3,2,2,3],  # Influencer
    7: [1,2,1,1,2,1,1,1,1,2],  # Regulator
}

def generate_synthetic_data():
    rows = []
    for ptype, base_answers in PERSONALITY_PROTOTYPES.items():
        for _ in range(SAMPLES_PER_PERSONALITY):
            noisy_answers = []
            for ans in base_answers:
                shift = random.choices([0, -1, 1], weights=[0.6, 0.2, 0.2])[0]
                new_ans = ans + shift
                new_ans = min(max(new_ans, 0), 3)
                noisy_answers.append(new_ans)
            row = {f"q{i}": noisy_answers[i] for i in range(len(QUESTIONS))}
            row["personality_type"] = ptype
            rows.append(row)
    return pd.DataFrame(rows)

def train_model():
    # 1) Generate data
    df = generate_synthetic_data()
    train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)

    # 2) Train decision tree
    X_train = train_df[[f"q{i}" for i in range(len(QUESTIONS))]]
    y_train = train_df["personality_type"]
    clf = DecisionTreeClassifier(
        criterion='entropy',
        max_depth=MAX_DEPTH,
        max_leaf_nodes=MAX_LEAF_NODES,
        random_state=123
    )
    clf.fit(X_train, y_train)

    # Evaluate
    X_test = test_df[[f"q{i}" for i in range(len(QUESTIONS))]]
    y_test = test_df["personality_type"]
    y_pred = clf.predict(X_test)
    acc = (y_pred == y_test).mean()
    print(f"Test Accuracy: {acc:.3f}")

    print("Classification report:")
    print(classification_report(y_test, y_pred))

    # Save confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(8,6))
    sns.heatmap(cm, annot=True, fmt='d')
    plt.title("Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("True")
    plt.savefig("data/confusion_matrix.png")
    plt.close()

    # 3) Convert to Partisia JSON
    convert_to_partisia_json(clf, "data/model.json")

def convert_to_partisia_json(clf, output_path):
    tree = clf.tree_
    internals = []
    leaves = []

    def recurse(node_id=0):
        left = tree.children_left[node_id]
        right = tree.children_right[node_id]
        is_leaf = (left == -1 and right == -1)
        if is_leaf:
            # One-hot
            major_class = int(np.argmax(tree.value[node_id][0]))
            arr = [0]*NUM_PERSONALITIES
            arr[major_class] = 1
            leaves.append({"classification": arr})
        else:
            feature_idx = int(tree.feature[node_id])
            threshold_val = int(tree.threshold[node_id])  # or round
            internals.append({
                "feature": feature_idx,
                "threshold": threshold_val
            })
            recurse(left)
            recurse(right)

    recurse(0)

    while len(internals) < 7:
        internals.append({"feature": 0, "threshold": 0})
    internals = internals[:7]

    while len(leaves) < 8:
        leaves.append({"classification": [0]*NUM_PERSONALITIES})
    leaves = leaves[:8]

    model = {
        "internals": internals,
        "leaves": leaves
    }
    
    with open(output_path, "w") as f:
        json.dump(model, f, indent=2)
    print(f"Saved Partisia model to {output_path}")

if __name__ == "__main__":
    train_model()
