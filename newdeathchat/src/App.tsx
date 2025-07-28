import Chat from './components/Chat'

function App(): JSX.Element {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white flex flex-col">
      <div className="flex-1 flex">
        <Chat />
      </div>
    </div>
  )
}

export default App
