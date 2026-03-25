import './App.css';
import { AppHeader } from './components/layout/AppHeader';
import { FilterBar } from './components/layout/FilterBar';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { ListView } from './components/list/ListView';
import { TimelineView } from './components/timeline/TimelineView';
import { useViewStore } from './store/viewStore';
import { useFilterSync } from './hooks/useFilterSync';
import { useCollaborationSim } from './hooks/useCollaborationSim';

function App() {
  const currentView = useViewStore((s) => s.currentView);

  useFilterSync();
  useCollaborationSim();

  return (
    <div className="h-full flex flex-col bg-surface-50 overflow-hidden">
      <AppHeader />
      <FilterBar />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {currentView === 'kanban' && <KanbanBoard />}
        {currentView === 'list' && <ListView />}
        {currentView === 'timeline' && <TimelineView />}
      </main>
    </div>
  );
}

export default App;
