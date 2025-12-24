function Bio() {
  return (
    <section className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-8 mb-12 border-2 border-purple-500/50 shadow-glow">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-glow mb-6 text-center">
          About Me
        </h2>
        <div className="text-purple-100 text-lg leading-relaxed space-y-4">
          <p>
            Welcome to my reading corner! I'm passionate about books and love exploring 
            different genres, from fiction to non-fiction, fantasy to science, and everything in between.
          </p>
          <p>
            This website is a personal collection of the books I've read, organized by year. 
            Each book card has a 3D flip animation - hover over them to see the title and author!
          </p>
          <p>
            Feel free to browse through my reading journey and discover some great reads.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Bio;

