import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Articles.css';
import Kikuyu from '../images/women.jpg';
import kenyaDefaultImage from '../images/lion.jpeg';

const Articles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedArticleId, setExpandedArticleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });

  const categories = ['History', 'Traditions', 'Food', 'Music', 'Travel'];

  // Sample full article about Kikuyu
  const kikuyuArticle = {
    artwork_id: 1,
    title: 'The Kikuyu People: Guardians of Kenyan Heritage',
    content: `
      **Introduction**  
      The Kikuyu, also spelled Gikuyu, are the largest ethnic group in Kenya, making up approximately 17% of the country’s population. Residing primarily in the Central Highlands, their homeland stretches across fertile lands around Mount Kenya, a sacred mountain they call *Kĩrĩnyaga* (the "Place of Brightness"). Known for their agricultural prowess, rich oral traditions, and resilience, the Kikuyu have played a pivotal role in shaping Kenya’s cultural, political, and economic landscape. This article delves into their history, customs, beliefs, and enduring legacy, offering a window into one of Africa’s most vibrant communities.

      **Historical Roots**  
      The origins of the Kikuyu are steeped in oral tradition, with their creation myth tracing back to Gikuyu, the founder, and his wife Mumbi. According to legend, Ngai (God), the supreme creator who resides atop Mount Kenya, gifted Gikuyu a beautiful land filled with rivers, forests, and fertile soil. From Gikuyu and Mumbi came nine daughters, who became the matriarchs of the nine Kikuyu clans: Achera, Agachiku, Airimu, Ambui, Angui, Anjiru, Angari, Aithaga, and Aceera. This matrilineal foundation underscores the significant role women have historically played in Kikuyu society.

      Archaeological evidence suggests the Kikuyu migrated to their current region around the 13th century, part of the larger Bantu expansion across East Africa. They developed a sophisticated agrarian lifestyle, cultivating crops like millet, sorghum, and later maize, introduced by colonial trade. Their settlements, organized into homesteads (*mũciĩ*), were self-sufficient, with land ownership central to their identity—a factor that fueled resistance during colonial times.

      The arrival of British colonialists in the late 19th century disrupted this harmony. The Kikuyu’s fertile lands were seized for European settlers, leading to widespread displacement. This sparked the Mau Mau Uprising (1952–1960), a Kikuyu-led rebellion against colonial rule. Figures like Dedan Kimathi emerged as symbols of resistance, cementing the Kikuyu’s reputation as fierce defenders of their rights. The struggle contributed significantly to Kenya’s independence in 1963, with Jomo Kenyatta, a Kikuyu, becoming the nation’s first president.

      **Cultural Traditions**  
      Kikuyu culture is a tapestry of rituals, music, dance, and oral storytelling, deeply rooted in their connection to the land and Ngai. One of the most significant rites of passage is *mweri* (circumcision), marking the transition from childhood to adulthood for both boys and girls historically, though female circumcision has largely been abandoned due to modern advocacy and legal bans. The ceremony, accompanied by songs and dances like *mũgoiyo*, prepares initiates for responsibilities within the community.

      Marriage customs are elaborate, involving *rũracio* (bride price negotiations), where the groom’s family offers livestock and goods to the bride’s family as a sign of respect and alliance. The wedding itself is a communal affair, with feasting, traditional brews like *njohi* (fermented sugarcane), and performances of *mũthũngũci*—a dance celebrating unity.

      Music and dance are integral, with instruments like the *gĩcandĩ* (a stringed instrument) and *njingiri* (rattles) accompanying songs that recount history, praise Ngai, or mark daily life. Proverbs (*ng’ano*) and riddles (*cayĩ*) are vital oral traditions, used to impart wisdom and entertain. For example, a common proverb, “*Gutiri mũndũ ũrĩa anjĩraga*” (“There is no one who does not need another”), emphasizes interdependence.

      The Kikuyu’s spiritual life revolves around Ngai, worshipped through prayers and offerings at sacred sites like fig trees (*mũgumo*). While Christianity has gained prominence since colonial times, many still blend traditional beliefs with modern faith, reflecting a dynamic cultural evolution.

      **Social Structure and Economy**  
      Traditionally, Kikuyu society was organized into age-sets (*riika*), where individuals of the same initiation group progressed through life stages together—youth, warriors, elders—each with specific roles. Elders (*kĩama*) governed through councils, resolving disputes and preserving customs. Land was held communally but managed by families, with inheritance passing through the male line, though women wielded influence as farmers and traders.

      Agriculture remains the backbone of Kikuyu life, with crops like tea, coffee, beans, and potatoes thriving in the volcanic soils of Central Kenya. Women, often called the “custodians of the soil,” manage small-scale farming, while men historically focused on livestock and trade. Today, Kikuyu entrepreneurs dominate Kenya’s business scene, from Nairobi’s bustling markets to tech startups, reflecting their adaptability.

      **Contemporary Significance**  
      In modern Kenya, the Kikuyu are a political and cultural force. Their prominence in post-independence leadership—exemplified by presidents Jomo Kenyatta, Mwai Kibaki, and Uhuru Kenyatta—has sparked both pride and debate about ethnic influence in governance. Urbanization has drawn many to cities like Nairobi, yet rural ties remain strong, with festivals like *Ngũrario* (marriage celebrations) drawing families back to ancestral lands.

      Challenges persist, including land disputes—a legacy of colonial dispossession—and the pressure of modernization on traditional practices. Yet, the Kikuyu continue to thrive, balancing heritage with progress. Initiatives like the *Gikuyu Cultural Festival* and literature by authors like Ngũgĩ wa Thiong’o keep their language (*Gĩkũyũ*) and stories alive, while youth engage through music and digital platforms.

      **Conclusion**  
      The Kikuyu are more than an ethnic group—they are guardians of a living heritage that has shaped Kenya’s soul. From their sacred bond with Mount Kenya to their fierce fight for independence, their story is one of resilience, creativity, and community. As Kenya strides into the future, the Kikuyu’s traditions and innovations ensure their culture remains a vibrant thread in the nation’s fabric. Whether through a song, a harvest, or a proverb, their legacy endures, inviting all to learn from and celebrate the "People of the Fig Tree."
    `,
    category: 'History',
    image_url: Kikuyu,
  };

  // Fetch articles from backend
  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/article');
      // Combine fetched articles with static Kikuyu article for demo
      setArticles([kikuyuArticle, ...response.data]);
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Fallback to static article if fetch fails
      setArticles([kikuyuArticle]);
    }
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  // Toggle article expansion
  const toggleArticle = (id) => {
    setExpandedArticleId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    fetchArticles();
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  // Filter articles based on search and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? article.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Featured article (e.g., first article or one marked as featured in backend)
  const featuredArticle = articles[0] || {};

  return (
    <div className={`articles-page ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="dashboard-header">
        <h1 className="kenyan-title">THE KENYAN CULTURE</h1>
        <div className="header-buttons">
          <Link to="/dashboard"><button>Dashboard</button></Link>
          <Link to="/destinations"><button>Destinations</button></Link>
          <Link to="/cart"><button>Cart ({cartItems.length})</button></Link>
          <Link to="/login"><button>Login</button></Link>
          <button onClick={toggleDarkMode}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      <div className="content-container">
        <div className="hero-section">
          <img src={kenyaDefaultImage} alt="Kenyan Culture" />
          <h1>Explore Kenyan Culture</h1>
          <p>Discover the rich heritage, traditions, and stories of Kenya.</p>
        </div>

        <div className="main-content">
          <div className="filter-section">
            <h3>Filter Articles</h3>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="articles-list">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <div
                  key={article.artwork_id}
                  className={`article-card ${index % 2 === 0 ? 'left' : 'right'}`}
                >
                  {index % 2 === 0 ? (
                    <>
                      <img
                        src={article.image_url || Kikuyu}
                        alt={article.title || 'No Title'}
                        className="article-image"
                        onClick={() => toggleArticle(article.artwork_id)}
                      />
                      <div className="article-content">
                        <h3
                          className="article-title"
                          onClick={() => toggleArticle(article.artwork_id)}
                        >
                          {article.title || 'Untitled'}
                        </h3>
                        {expandedArticleId === article.artwork_id ? (
                          <p className="article-description">
                            {article.content || 'No description available'}
                          </p>
                        ) : (
                          <p className="article-snippet">
                            {article.content
                              ? article.content.slice(0, 100) + '...'
                              : 'No description available'}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="article-content">
                        <h3
                          className="article-title"
                          onClick={() => toggleArticle(article.artwork_id)}
                        >
                          {article.title || 'Untitled'}
                        </h3>
                        {expandedArticleId === article.artwork_id ? (
                          <p className="article-description">
                            {article.content || 'No description available'}
                          </p>
                        ) : (
                          <p className="article-snippet">
                            {article.content
                              ? article.content.slice(0, 100) + '...'
                              : 'No description available'}
                          </p>
                        )}
                      </div>
                      <img
                        src={article.image_url || Kikuyu}
                        alt={article.title || 'No Title'}
                        className="article-image"
                        onClick={() => toggleArticle(article.artwork_id)}
                      />
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>No articles match your criteria</p>
            )}
          </div>
        </div>

        <section className="featured-article">
          <h2>Featured Article</h2>
          <div className="featured-card">
            <img
              src={featuredArticle.image_url || Kikuyu}
              alt={featuredArticle.title || 'Featured Article'}
              className="featured-image"
            />
            <div className="featured-content">
              <h3>{featuredArticle.title || 'No Title'}</h3>
              <p>{featuredArticle.content?.slice(0, 200) + '...' || 'No description available'}</p>
              <button onClick={() => toggleArticle(featuredArticle.artwork_id)}>
                Read More
              </button>
            </div>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-text">
            <p>© 2025 The Kenyan Culture. All rights reserved.</p>
          </div>
          <div className="social-icons">
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Articles;