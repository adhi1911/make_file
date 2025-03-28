import pandas as pd
from sklearn.model_selection import train_test_split
import numpy as np
import os
import src.globals as globals

GENERATED_FILES_DIRECTORY = "generated_files"
os.makedirs(GENERATED_FILES_DIRECTORY, exist_ok=True)

def split_and_generate_files(uploaded_df, target_column, test_size, public_leaderboard):
    if uploaded_df is None or target_column is None or test_size is None:
        raise ValueError("Data, target column, or test size not set")

    # Split the data into train and test sets
    X = uploaded_df.drop(columns=[target_column])
    y = uploaded_df[target_column]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, 
        test_size=test_size, 
        random_state=42,
        stratify=y if len(y.unique()) < len(y)/2 else None
    )

    # Add ID column to both train and test
    X_train['ID'] = range(1, len(X_train) + 1)
    X_test['ID'] = range(1, len(X_test) + 1)

    # Prepare dataframes
    train_df = pd.concat([X_train, pd.Series(y_train, name=target_column)], axis=1)
    test_df = X_test.copy()

    # Create evaluation file
    evaluation_df = pd.DataFrame()
    evaluation_df['ID'] = test_df['ID']
    evaluation_df['Usage'] = np.random.choice(
        ['Public', 'Private'], 
        size=len(test_df), 
        p=[public_leaderboard, 1-public_leaderboard]
    )
    evaluation_df[target_column] = y_test.values

    # extract unique values from target column for samplesubmission
    unique_values = y.unique().tolist()

    # Create sample submission file with random predictions
    sample_submission_df = pd.DataFrame()
    sample_submission_df['ID'] = test_df['ID']
    sample_submission_df[target_column] = np.random.choice(unique_values, size=len(test_df))

    # Save all files
    train_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'train.csv'), index=False)
    test_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'test.csv'), index=False)
    evaluation_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'evaluation.csv'), index=False)
    sample_submission_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'sample_submission.csv'), index=False)

def split_and_generate_binary_classification_files(uploaded_df, target_column, test_size, public_leaderboard, positive_label, negative_label, replace_label=None):
    """
    Generate binary classification files with proper label handling.
    
    Args:
        uploaded_df (pd.DataFrame): Input dataset
        target_column (str): Name of the target column
        test_size (float): Proportion of dataset to be test set
        public_leaderboard (float): Proportion of test set for public leaderboard
        positive_label (str): Value to be treated as positive class
        negative_label (str): Value to be treated as negative class
        replace_label (str): Value to replace all other labels (should match negative_label)
    """
    if uploaded_df is None or target_column is None or test_size is None:
        raise ValueError("Data, target column, or test size not set")

    # Handle binary classification preprocessing
    df = uploaded_df.copy()
    unique_values = df[target_column].unique()
    print(positive_label, negative_label, unique_values)
    
    # Fix: Only replace values that are not positive_label or negative_label
    if len(unique_values) > 2:
        if replace_label is None:
            raise ValueError("More than 2 unique values in target column. Please provide a replace label.")
        
        # Create a mapping dictionary
        label_map = {val: replace_label if val not in [positive_label, negative_label] else val 
                    for val in unique_values}
        
        # Apply mapping to target column
        df[target_column] = df[target_column].map(label_map)
        
        # Verify the transformation
        final_unique_values = df[target_column].unique()
        if len(final_unique_values) != 2:
            raise ValueError(f"Failed to convert to binary. Values present: {final_unique_values}")


    # Split the data
    X = df.drop(columns=[target_column])
    y = df[target_column]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, 
        test_size=test_size, 
        random_state=42,
        stratify=y
    )

    # Add ID column
    X_train['ID'] = range(1, len(X_train) + 1)
    X_test['ID'] = range(1, len(X_test) + 1)

    # Prepare dataframes
    train_df = pd.concat([X_train, pd.Series(y_train, name=target_column)], axis=1)
    test_df = X_test.copy()

    # Create evaluation file
    evaluation_df = pd.DataFrame()
    evaluation_df['ID'] = test_df['ID']
    evaluation_df['Usage'] = np.random.choice(
        ['Public', 'Private'], 
        size=len(test_df), 
        p=[public_leaderboard, 1-public_leaderboard]
    )
    evaluation_df[target_column] = y_test.values

    # Create sample submission file with random binary class labels
    sample_submission_df = pd.DataFrame()
    sample_submission_df['ID'] = test_df['ID']
    sample_submission_df[target_column] = np.random.choice(
        [positive_label, negative_label], 
        size=len(test_df)
    )

    # Save all files
    train_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'train.csv'), index=False)
    test_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'test.csv'), index=False)
    evaluation_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'evaluation.csv'), index=False)
    sample_submission_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'sample_submission.csv'), index=False)