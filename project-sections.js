(() => {
  const labels = {
    llm: 'LLM разработка',
    design: 'Графический дизайн',
  };

  function sectionOf(project) {
    if (Object.hasOwn(labels, project.section)) return project.section;
    return 'llm';
  }

  window.ProjectSections = { labels, sectionOf };
})();
