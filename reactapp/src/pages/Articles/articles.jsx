import { useEffect, useState } from 'react';

// In order to use react hooks like the `useCookies` hook, the must use functional components.
// Functional components are the industry standard for the react components at the moment.
// Class components vs Functional components: https://www.geeksforgeeks.org/differences-between-functional-components-and-class-components/
const Articles = () => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        populateArticleData();
    }, [])

    const populateArticleData = async () => {
        const token = localStorage.getItem("token")
        const response = await fetch('/home', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await response.json();
        setArticles(data)
        setLoading(false)
    }

    const renderArticlesTable = (articles) => {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Summary</th>
                        <th>Link</th>
                        <th>Published</th>
                        <th>Topic</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.map(article =>
                        <tr key={article.title}>
                            <td>{article.title}</td>
                            <td>{article.summary}</td>
                            <td><a href={article.link} target="_blank" rel="noopener noreferrer">{article.link}</a></td>
                            <td>{article.published}</td>
                            <td>{article.topic.join(", ")}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    return (
        <div>
            <h1 id="tabelLabel">Article List</h1>
            {loading
                ? <p><em>Loading...</em></p>
                : renderArticlesTable(articles)}
        </div >
    );
}

export default Articles;
