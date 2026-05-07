import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDown, ArrowUp, Copy, Download, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import {
  DEFAULT_PROJECT_CMS_STATE,
  type FeaturedProjectData,
  type ProjectCmsState,
  type ProjectFolder,
  type ProjectTag,
  type Status,
  type TopProject,
} from '../../data/projects';
import {
  getProjectCmsState,
  resetProjectCmsState,
  saveProjectCmsState,
  serializeProjectCmsState,
} from '../../utils/project-cms';
import styles from './ProjectEditorPage.module.css';

const STATUS_OPTIONS: Status[] = ['active', 'wip', 'archived'];
const TAG_OPTIONS: ProjectTag[] = [
  'featured',
  'fullstack',
  'internship',
  'backend',
  'frontend',
  'ui-design',
  'database',
  'microservice',
  'mobile',
  'ai',
  'security',
  'docker',
  'discord',
  'library',
  'wip',
];

function makeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `project-${Date.now()}`;
}

function createBlankDetail(id: string, title: string): FeaturedProjectData {
  return {
    id,
    title,
    subtitle: 'Project subtitle',
    year: 'Coming Soon',
    template: 'case-study',
    tags: ['wip'],
    overview: 'Write the project overview here.',
    problemStatement: ['Describe the background or problem.'],
    objectives: ['Describe the main objective.'],
    highlights: ['Add a key highlight.'],
    challenges: [{ title: 'Challenge', description: 'Describe a challenge.' }],
    feasibility: 'Describe feasibility.',
    targetAudience: 'Describe target users.',
    systemOverview: ['Describe the proposed system.'],
    workflow: ['Describe the first workflow step.'],
    features: {
      users: ['User feature'],
      admin: ['Admin feature'],
    },
    infrastructure: [
      { label: 'Layer', items: ['Service'], connector: 'Flow' },
    ],
    techStack: [
      { category: 'Stack', items: ['React'] },
    ],
    images: [],
    links: {},
  };
}

function createBlankFolder(id: string, title: string): ProjectFolder {
  return {
    id: `${id}-folder`,
    title,
    description: 'Short project description.',
    category: 'fullstack',
    categoryLabel: 'Full Stack',
    tags: ['wip'],
    status: 'wip',
    year: 'Coming Soon',
    tech: ['React'],
    detailId: id,
  };
}

function createBlankTopProject(id: string, title: string, number: string): TopProject {
  return {
    id,
    number,
    title,
    description: 'Short featured project description.',
    categoryLabel: 'Full Stack',
    status: 'wip',
    tech: ['React'],
    accent: 'orange',
    detailId: id,
  };
}

function splitCsv(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export function ProjectEditorPage() {
  const navigate = useNavigate();
  const [cmsState, setCmsState] = useState<ProjectCmsState>(() => getProjectCmsState());
  const [selectedId, setSelectedId] = useState(() => Object.keys(getProjectCmsState().featuredProjects)[0] ?? '');
  const selectedDetail = cmsState.featuredProjects[selectedId];
  const selectedFolder = cmsState.projectFolders.find((project) => project.detailId === selectedId || project.id === `${selectedId}-folder`);
  const selectedTopProject = cmsState.topProjects.find((project) => project.detailId === selectedId || project.id === selectedId);
  const [detailJson, setDetailJson] = useState(() => JSON.stringify(selectedDetail ?? {}, null, 2));
  const [message, setMessage] = useState('Local editor ready.');

  const projectIds = useMemo(() => Object.keys(cmsState.featuredProjects), [cmsState.featuredProjects]);

  function selectProject(id: string) {
    setSelectedId(id);
    setDetailJson(JSON.stringify(cmsState.featuredProjects[id] ?? {}, null, 2));
    setMessage(`Editing ${id}`);
  }

  function updateState(nextState: ProjectCmsState, nextMessage?: string) {
    setCmsState(nextState);
    if (nextMessage) setMessage(nextMessage);
  }

  function updateFolder(patch: Partial<ProjectFolder>) {
    if (!selectedFolder) return;
    updateState({
      ...cmsState,
      projectFolders: cmsState.projectFolders.map((project) =>
        project.id === selectedFolder.id ? { ...project, ...patch } : project,
      ),
    });
  }

  function updateTopProject(patch: Partial<TopProject>) {
    if (!selectedTopProject) return;
    updateState({
      ...cmsState,
      topProjects: cmsState.topProjects.map((project) =>
        project.id === selectedTopProject.id ? { ...project, ...patch } : project,
      ),
    });
  }

  function saveDetailJson() {
    try {
      const parsed = JSON.parse(detailJson) as FeaturedProjectData;
      if (!parsed.id || !parsed.title) {
        setMessage('Detail JSON must include id and title.');
        return;
      }
      const nextState = {
        ...cmsState,
        featuredProjects: {
          ...cmsState.featuredProjects,
          [parsed.id]: parsed,
        },
      };
      updateState(nextState, `Updated detail content for ${parsed.title}.`);
      if (parsed.id !== selectedId) setSelectedId(parsed.id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Invalid JSON.');
    }
  }

  function saveAll() {
    try {
      const parsed = JSON.parse(detailJson) as FeaturedProjectData;
      if (!parsed.id || !parsed.title) {
        setMessage('Detail JSON must include id and title.');
        return;
      }
      const nextState = {
        ...cmsState,
        featuredProjects: {
          ...cmsState.featuredProjects,
          [parsed.id]: parsed,
        },
      };
      saveProjectCmsState(nextState);
      setCmsState(nextState);
      if (parsed.id !== selectedId) setSelectedId(parsed.id);
      setMessage('Saved to localStorage. Open Projects/Details to preview.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Invalid JSON.');
    }
  }

  function addProject() {
    const title = `New Project ${projectIds.length + 1}`;
    const id = makeSlug(title);
    const nextState = {
      ...cmsState,
      featuredProjects: {
        ...cmsState.featuredProjects,
        [id]: createBlankDetail(id, title),
      },
      projectFolders: [
        createBlankFolder(id, title),
        ...cmsState.projectFolders,
      ],
      topProjects: cmsState.topProjects,
    };
    updateState(nextState, `Created ${title}.`);
    setSelectedId(id);
    setDetailJson(JSON.stringify(nextState.featuredProjects[id], null, 2));
  }

  function deleteProject() {
    if (!selectedId) return;
    const remainingFeatured = Object.fromEntries(
      Object.entries(cmsState.featuredProjects).filter(([id]) => id !== selectedId),
    );
    const nextState = {
      ...cmsState,
      featuredProjects: remainingFeatured,
      projectFolders: cmsState.projectFolders.filter((project) => project.detailId !== selectedId),
      topProjects: cmsState.topProjects.filter((project) => project.detailId !== selectedId && project.id !== selectedId),
    };
    const nextId = Object.keys(remainingFeatured)[0] ?? '';
    updateState(nextState, `Deleted ${selectedId}.`);
    setSelectedId(nextId);
    setDetailJson(JSON.stringify(nextState.featuredProjects[nextId] ?? {}, null, 2));
  }

  function moveTopProject(direction: -1 | 1) {
    if (!selectedTopProject) return;
    const index = cmsState.topProjects.findIndex((project) => project.id === selectedTopProject.id);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= cmsState.topProjects.length) return;
    const nextTopProjects = [...cmsState.topProjects];
    [nextTopProjects[index], nextTopProjects[nextIndex]] = [nextTopProjects[nextIndex], nextTopProjects[index]];
    const numberedTopProjects = nextTopProjects.map((project, i) => ({
      ...project,
      number: String(i + 1).padStart(2, '0'),
    }));
    updateState({ ...cmsState, topProjects: numberedTopProjects }, 'Updated ranking order.');
  }

  function addToTopProjects() {
    if (!selectedDetail || selectedTopProject) return;
    const nextTopProject = createBlankTopProject(selectedDetail.id, selectedDetail.title, String(cmsState.topProjects.length + 1).padStart(2, '0'));
    updateState({
      ...cmsState,
      topProjects: [...cmsState.topProjects, nextTopProject],
    }, 'Added to Top Projects.');
  }

  function resetAll() {
    resetProjectCmsState();
    setCmsState(DEFAULT_PROJECT_CMS_STATE);
    const firstId = Object.keys(DEFAULT_PROJECT_CMS_STATE.featuredProjects)[0] ?? '';
    setSelectedId(firstId);
    setDetailJson(JSON.stringify(DEFAULT_PROJECT_CMS_STATE.featuredProjects[firstId] ?? {}, null, 2));
    setMessage('Reset to code defaults.');
  }

  async function copyExport() {
    const output = serializeProjectCmsState(cmsState);
    await navigator.clipboard.writeText(output);
    setMessage('Copied CMS JSON to clipboard.');
  }

  function downloadExport() {
    const blob = new Blob([serializeProjectCmsState(cmsState)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'fujipp-project-cms.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage('Downloaded CMS JSON export.');
  }

  return (
    <main className={styles.page}>
      <section className={styles.editorShell}>
        <header className={styles.header}>
          <button type="button" className={styles.backBtn} onClick={() => navigate('/projects')}>
            <ArrowLeft size={15} /> Projects
          </button>
          <div>
            <p className={styles.eyebrow}>LOCAL PROJECT CMS</p>
            <h1>Projects Editor</h1>
            <p>เพิ่ม แก้ไข จัดหมวด จัดอันดับ และ export เนื้อหา Projects/Details ได้จากหน้านี้</p>
          </div>
          <div className={styles.headerActions}>
            <button type="button" onClick={addProject}><Plus size={15} /> Add</button>
            <button type="button" onClick={saveAll}><Save size={15} /> Save</button>
            <button type="button" onClick={copyExport}><Copy size={15} /> Copy JSON</button>
            <button type="button" onClick={downloadExport}><Download size={15} /> Export</button>
            <button type="button" onClick={resetAll}><RotateCcw size={15} /> Reset</button>
          </div>
        </header>

        <div className={styles.statusBar}>{message}</div>

        <div className={styles.editorGrid}>
          <aside className={styles.projectList}>
            <p className={styles.panelLabel}>Projects</p>
            {projectIds.map((id) => (
              <button
                key={id}
                type="button"
                className={`${styles.projectPick} ${id === selectedId ? styles.projectPickActive : ''}`}
                onClick={() => selectProject(id)}
              >
                <span>{cmsState.featuredProjects[id].title}</span>
                <small>{id}</small>
              </button>
            ))}
          </aside>

          <section className={styles.formPanel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelLabel}>Directory Content</p>
                <h2>{selectedDetail?.title ?? 'No project selected'}</h2>
              </div>
              <button type="button" className={styles.deleteBtn} onClick={deleteProject}>
                <Trash2 size={15} /> Delete
              </button>
            </div>

            {selectedFolder && (
              <div className={styles.fieldGrid}>
                <label>
                  Folder Title
                  <input value={selectedFolder.title} onChange={(e) => updateFolder({ title: e.target.value })} />
                </label>
                <label>
                  Category Label
                  <input value={selectedFolder.categoryLabel} onChange={(e) => updateFolder({ categoryLabel: e.target.value })} />
                </label>
                <label className={styles.fullField}>
                  Description
                  <textarea value={selectedFolder.description} onChange={(e) => updateFolder({ description: e.target.value })} />
                </label>
                <label>
                  Status
                  <select value={selectedFolder.status} onChange={(e) => updateFolder({ status: e.target.value as Status })}>
                    {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <label>
                  Year
                  <input value={selectedFolder.year} onChange={(e) => updateFolder({ year: e.target.value })} />
                </label>
                <label className={styles.fullField}>
                  Tech CSV
                  <input value={selectedFolder.tech.join(', ')} onChange={(e) => updateFolder({ tech: splitCsv(e.target.value) })} />
                </label>
                <label className={styles.fullField}>
                  Tags
                  <div className={styles.tagGrid}>
                    {TAG_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={selectedFolder.tags.includes(tag) ? styles.tagActive : ''}
                        onClick={() => {
                          const tags = selectedFolder.tags.includes(tag)
                            ? selectedFolder.tags.filter((item) => item !== tag)
                            : [...selectedFolder.tags, tag];
                          updateFolder({ tags });
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </label>
              </div>
            )}

            <div className={styles.rankPanel}>
              <div>
                <p className={styles.panelLabel}>Top Projects Rank</p>
                <p>{selectedTopProject ? `${selectedTopProject.number} · ${selectedTopProject.title}` : 'This project is not ranked.'}</p>
              </div>
              <div className={styles.rankActions}>
                <button type="button" onClick={() => moveTopProject(-1)} disabled={!selectedTopProject}><ArrowUp size={15} /> Up</button>
                <button type="button" onClick={() => moveTopProject(1)} disabled={!selectedTopProject}><ArrowDown size={15} /> Down</button>
                <button type="button" onClick={addToTopProjects} disabled={!selectedDetail || Boolean(selectedTopProject)}>Add to Rank</button>
              </div>
            </div>

            {selectedTopProject && (
              <div className={styles.fieldGrid}>
                <label>
                  Rank Category
                  <input value={selectedTopProject.categoryLabel} onChange={(e) => updateTopProject({ categoryLabel: e.target.value })} />
                </label>
                <label>
                  Accent
                  <select value={selectedTopProject.accent} onChange={(e) => updateTopProject({ accent: e.target.value as TopProject['accent'] })}>
                    <option value="primary">primary</option>
                    <option value="purple">purple</option>
                    <option value="orange">orange</option>
                  </select>
                </label>
                <label className={styles.fullField}>
                  Rank Description
                  <textarea value={selectedTopProject.description} onChange={(e) => updateTopProject({ description: e.target.value })} />
                </label>
                <label className={styles.fullField}>
                  Rank Tech CSV
                  <input value={selectedTopProject.tech.join(', ')} onChange={(e) => updateTopProject({ tech: splitCsv(e.target.value) })} />
                </label>
              </div>
            )}
          </section>

          <section className={styles.jsonPanel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelLabel}>Detail Template JSON</p>
                <h2>Project Detail Content</h2>
              </div>
              <button type="button" onClick={saveDetailJson}><Save size={15} /> Apply JSON</button>
            </div>
            <textarea
              className={styles.jsonEditor}
              spellCheck={false}
              value={detailJson}
              onChange={(e) => setDetailJson(e.target.value)}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
