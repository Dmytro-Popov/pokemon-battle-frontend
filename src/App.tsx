function App(): React.JSX.Element {
  return (
    <>
      <button className="brut-sm press bg-primary px-4 py-2 text-primary-foreground">
        Сражаться
      </button>
      <article className="pokemon-card">
        <h2 className="font-pixel">Pikachu</h2>
        <p className="mt-2 text-muted-foreground">Электрический покемон</p>
      </article>
    </>
  )
}

export default App
