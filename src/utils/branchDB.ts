export const getBranches = (collegeName: string): string[] => {
  const store = localStorage.getItem('branchesDB_dict');
  if (store) {
    const dict = JSON.parse(store);
    if (dict[collegeName]) {
      return dict[collegeName];
    }
  }
  const defaultBranches = ['B.Tech CSE', 'B.Tech ECE', 'BBA', 'BCA', 'MBA', 'MCA'];
  saveBranches(defaultBranches, collegeName);
  return defaultBranches;
};

export const saveBranches = (branches: string[], collegeName: string) => {
  const store = localStorage.getItem('branchesDB_dict');
  const dict = store ? JSON.parse(store) : {};
  dict[collegeName] = branches;
  localStorage.setItem('branchesDB_dict', JSON.stringify(dict));
};
