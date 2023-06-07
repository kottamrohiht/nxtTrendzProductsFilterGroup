import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstans = {
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apistatus: apiStatusConstans.loading,
    activeOptionId: sortbyOptions[0].optionId,
    category: '',
    rating: '',
    title: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apistatus: apiStatusConstans.loading,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, rating, category, title} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${title}&rating=${rating}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apistatus: apiStatusConstans.success,
      })
    } else {
      this.setState({
        apistatus: apiStatusConstans.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  clearFiltersApplied = () => {
    this.setState(
      {
        activeOptionId: sortbyOptions[0].optionId,
        category: '',
        rating: '',
        title: '',
      },
      this.getProducts,
    )
  }

  updateTitle = userTxt => {
    this.setState(
      {
        title: userTxt,
      },
      this.getProducts,
    )
  }

  updatedCategory = id => {
    this.setState(
      {
        category: id,
      },
      this.getProducts,
    )
  }

  updatedRating = id => {
    this.setState(
      {
        rating: id,
      },
      this.getProducts,
    )
  }

  noProductsView = () => (
    <div className="no-products-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="no-products"
      />
      <h1 className="no-productsHeading">No Products Found</h1>
      <p className="no-productsPara">
        We could not find any products.Try other filters.
      </p>
    </div>
  )

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return productsList.length === 0 ? (
      this.noProductsView()
    ) : (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="no-products-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="no-products"
      />
      <h1 className="no-productsHeading"> Oops! Something Went Wrong </h1>
      <p className="no-productsPara">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderApiStatus = () => {
    const {apistatus} = this.state

    switch (apistatus) {
      case apiStatusConstans.success:
        return this.renderProductsList()
      case apiStatusConstans.loading:
        return this.renderLoader()
      case apiStatusConstans.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  // TODO: Add failure view

  render() {
    const {category, rating} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element {isLoading ? this.renderLoader() : this.renderProductsList()} */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          updatedCategory={this.updatedCategory}
          updatedRating={this.updatedRating}
          updateTitle={this.updateTitle}
          clearFiltersApplied={this.clearFiltersApplied}
          activeCat={category}
          activeRating={rating}
        />
        {this.renderApiStatus()}
      </div>
    )
  }
}

export default AllProductsSection
