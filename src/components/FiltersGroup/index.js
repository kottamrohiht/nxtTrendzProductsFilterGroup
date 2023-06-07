import {Component} from 'react'

import {BsSearch} from 'react-icons/bs'

import './index.css'

class FiltersGroup extends Component {
  state = {
    userTxt: '',
  }

  onChangeInput = event => {
    this.setState({
      userTxt: event.target.value,
    })
  }

  keyDownEvent = event => {
    if (event.key === 'Enter') {
      const {userTxt} = this.state
      const {updateTitle} = this.props
      updateTitle(userTxt)

      this.setState({
        userTxt: '',
      })
    }
  }

  onClickCategory = event => {
    const {updatedCategory} = this.props
    const id = event.currentTarget.value
    updatedCategory(id)
  }

  onClickRating = event => {
    const {updatedRating} = this.props
    const id = event.currentTarget.value
    updatedRating(id)
  }

  clearFilters = () => {
    const {clearFiltersApplied} = this.props
    clearFiltersApplied()
  }

  render() {
    const {categoryOptions, ratingsList, activeCat, activeRating} = this.props
    const {userTxt} = this.state

    return (
      <div className="filters-group-container">
        <div className="input-container-el">
          <input
            id="search"
            type="search"
            value={userTxt}
            className="searchel"
            placeholder="Search"
            onChange={this.onChangeInput}
            onKeyDown={this.keyDownEvent}
          />
          <BsSearch className="BsSearch" />
        </div>

        <div className="category-container">
          <h1 className="category"> Category </h1>
          {categoryOptions.map(each => (
            <button
              onClick={this.onClickCategory}
              className={`${
                each.categoryId === activeCat ? 'active-css' : 'category-button'
              }`}
              type="button"
              key={each.categoryId}
              value={each.categoryId}
            >
              <p className="category-para"> {each.name} </p>
            </button>
          ))}
        </div>

        <div className="category-container">
          <h1 className="category"> Rating </h1>
          {ratingsList.map(item => (
            <button
              onClick={this.onClickRating}
              className="category-button"
              type="button"
              key={item.ratingId}
              value={item.ratingId}
            >
              <img
                src={item.imageUrl}
                alt={`'rating' ${item.ratingId}`}
                className="rating-img"
              />
              <p
                className={` ${
                  item.ratingId === activeRating ? 'up-acitve-css' : 'up'
                }`}
              >
                & Up
              </p>
            </button>
          ))}
        </div>
        <button
          onClick={this.clearFilters}
          type="button"
          className="clear-filter"
        >
          {' '}
          Clear Filters{' '}
        </button>
      </div>
    )
  }
}

export default FiltersGroup
