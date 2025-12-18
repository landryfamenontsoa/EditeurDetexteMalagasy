import { ThemeProvider } from '@/contexts/ThemeContext'
import './App.css'
import AppLayout from './components/layout/AppLayout';
import TextEditor from './components/Editor/TextEditor';

function App() {
  return (
    <ThemeProvider>
      <AppLayout>
        <TextEditor />
      </AppLayout>
    </ThemeProvider>
  )
}

export default App
