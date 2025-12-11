"""
Test History Manager - Manages storage and retrieval of QA test results
"""

import json
import os
from datetime import datetime


class TestHistory:
    """Manages test history storage"""
    
    def __init__(self, history_file='history/test_history.json'):
        self.history_file = history_file
        self._ensure_history_file()
    
    def _ensure_history_file(self):
        """Ensure history file and directory exist"""
        os.makedirs(os.path.dirname(self.history_file), exist_ok=True)
        if not os.path.exists(self.history_file):
            with open(self.history_file, 'w') as f:
                json.dump([], f)
    
    def add_project(self, project_data):
        """Add a new project to history"""
        try:
            history = self._load_history()
            history.insert(0, project_data)  # Add to beginning
            
            # Keep only last 100 projects
            if len(history) > 100:
                history = history[:100]
            
            self._save_history(history)
            return True
        except Exception as e:
            print(f"Error adding project to history: {str(e)}")
            return False
    
    def get_all_projects(self):
        """Get all projects from history"""
        return self._load_history()
    
    def get_project_by_name(self, project_name):
        """Get a specific project by name"""
        history = self._load_history()
        for project in history:
            if project.get('project_name') == project_name:
                return project
        return None
    
    def _load_history(self):
        """Load history from file"""
        try:
            with open(self.history_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    
    def _save_history(self, history):
        """Save history to file"""
        with open(self.history_file, 'w') as f:
            json.dump(history, f, indent=2)
