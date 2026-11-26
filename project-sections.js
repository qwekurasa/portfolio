(() => {
  const labels = {
    llm: 'LLM разработка',
    design: 'Графический дизайн',
    sites: 'Сайты',
  };

  function sectionOf(project) {
    if (Object.hasOwn(labels, project.section)) return project.section;
    return project.type === 'Сайт' ? 'sites' : 'llm';
  }

  window.ProjectSections = { labels, sectionOf };
})();
