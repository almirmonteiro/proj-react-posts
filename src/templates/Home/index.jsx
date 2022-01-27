import './styles.css';

import { Component } from 'react';

import { loadPosts } from '../../utils/load-posts'
import { Posts } from '../../components/Posts';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

class Home extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 4,
    searchValue: ''
  };
  timeoutUpdate = null;

  async componentDidMount() {
    await this.loadPosts();
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {

  }

  loadPosts = async () => {
    const { page, postsPerPage } = this.state;
    const postsAndPhotos = await loadPosts();
    this.setState(
      {
        posts: postsAndPhotos.slice(page, postsPerPage),
        allPosts: postsAndPhotos,
      }
    );

  }
  handleTimeout = () => {
    const { posts, counter } = this.state;
    posts[0].title = 'O titulo mudou';
    console.log('OI, montei');
    this.timeoutUpdate = setTimeout(() => {
      this.setState({ posts, counter: counter + 1 })
    }, 1000);
  }

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ searchValue: value });
  }

  loadMorePosts = () => {
    const {
      page,
      postsPerPage,
      allPosts,
      posts
    } = this.state;
    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage)
    posts.push(...nextPosts);
    this.setState({ posts, page: nextPage });
  }
  render() {
    const { posts, page, postsPerPage, allPosts, searchValue } = this.state;
    const noMorePosts = page + postsPerPage > allPosts.length;

    const filteredPosts = !!searchValue ?
      allPosts.filter(post => {
        return post.title.toLowerCase().includes(searchValue)
      }
      ) :
      posts;
    return (
      <section className="container">
        <div className="search-container">
          {!!searchValue && (
            <h1> Search Value: {searchValue} </h1>
          )}
          <TextInput
            searchValue={searchValue}
            handleChange={this.handleChange}
          />
        </div>
        {filteredPosts.length > 0 && (
          <Posts posts={filteredPosts} />
        )}
        {filteredPosts.length === 0 && (
          <p> Não Existem Posts para essa Pesquisa </p>
        )}

        <div className="button-container">
          {!searchValue && (
            <Button
              text="Mais Posts"
              fClick={this.loadMorePosts}
              disabled={noMorePosts}
            />
          )}
        </div>
      </section>
    );
  }
}

export default Home;
