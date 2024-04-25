/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const categories = categoriesFromServer.map(category => {
  const user = usersFromServer.find(owner => owner.id === category.ownerId);

  return {
    ...category,
    user,
  };
});

const products = productsFromServer.map(product => {
  const category = categories.find(
    findCategory => findCategory.id === product.categoryId,
  );

  return {
    ...product,
    category,
  };
});

const TABLE_HEADER = ['ID', 'Product', 'Category', 'User'];
const USERS_FILTER = usersFromServer.map(user => user.name);
const CATEGORIES_FILTER = categoriesFromServer.map(category => category.title);
const ASC_SORT = 'asc';
const DESC_SORT = 'desc';

USERS_FILTER.unshift('All');
CATEGORIES_FILTER.unshift('All');

export const App = () => {
  const [filterByUser, setFilterByUser] = useState('All');
  const [filterByCategory, setfilterByCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState(ASC_SORT);
  const [sortClass, setSortClass] = useState('');

  let visibleGoods = [...products];

  if (filterByUser !== 'All') {
    visibleGoods = visibleGoods.filter(
      good => good.category.user.name === filterByUser,
    );
  }

  if (filterByCategory !== 'All') {
    visibleGoods = visibleGoods.filter(
      good => good.category.title === filterByCategory,
    );
  }

  if (query !== '') {
    visibleGoods = visibleGoods.filter(good => {
      const prettyQuery = query.toLowerCase().trim();
      const prettyGood = good.name.toLowerCase().trim();

      return prettyGood.includes(prettyQuery);
    });
  }

  const handleSort = value => {
    if (sortBy !== value) {
      setSortBy(value);
      setSortOrder(ASC_SORT);
      setSortClass(ASC_SORT);

      return;
    }

    if (sortBy === value && sortOrder === ASC_SORT) {
      setSortOrder(DESC_SORT);
      setSortClass(DESC_SORT);

      return;
    }

    setSortBy('');
    setSortOrder(ASC_SORT);
    setSortClass('');
  };

  if (sortBy !== '') {
    const prettySortBy = sortBy.toLowerCase();

    visibleGoods.sort((good1, good2) => {
      let result;

      switch (prettySortBy) {
        case 'id':
          result = good1.id - good2.id;
          break;
        case 'product':
          result = good1.name.localeCompare(good2.name);
          break;
        case 'category':
          result = good1.category.title.localeCompare(good2.category.title);
          break;
        case 'user':
          result = good1.category.user.name.localeCompare(
            good2.category.user.name,
          );
          break;
        default:
          return 0;
      }

      return sortOrder === ASC_SORT ? result : result * -1;
    });
  }

  function handleResetAll() {
    setFilterByUser('All');
    setfilterByCategory('All');
    setQuery('');
    setSortBy('');
    setSortOrder(ASC_SORT);
    setSortClass('');
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              {USERS_FILTER.map((user, i) => (
                <a
                  key={user}
                  data-cy={
                    user[i] === user[0] ? 'FilterAllUsers' : 'FilterUser'
                  }
                  href="#/"
                  className={cn('', { 'is-active': filterByUser === user })}
                  onClick={() => setFilterByUser(user)}
                >
                  {user}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setQuery('')}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              {CATEGORIES_FILTER.map((category, i) => (
                <a
                  key={category}
                  href="#/"
                  data-cy={
                    category[i] === category[0] ? 'AllCategories' : 'Category'
                  }
                  className={cn('button', {
                    'is-success mr-6 is-outlined': category[i] === category[0],
                    'mr-2 my-1': category[i] !== category[0],
                    'mr-2 my-1 is-info':
                      category[i] !== category[0] &&
                      category === filterByCategory,
                  })}
                  onClick={() => setfilterByCategory(category)}
                >
                  {category}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleGoods.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {TABLE_HEADER.map(item => (
                    <th key={item}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {item}
                        <a href="#/" onClick={() => handleSort(item)}>
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn('fa', {
                                'fa-sort-up': sortClass === ASC_SORT,
                                'fa-sort-down': sortClass === DESC_SORT,
                                'fa-sort':
                                  sortClass !== ASC_SORT &&
                                  sortClass !== DESC_SORT,
                              })}
                            />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleGoods.map(good => {
                  const { category } = good;
                  const { user } = category;

                  return (
                    <tr data-cy="Product" key={good.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {good.id}
                      </td>

                      <td data-cy="ProductName">{good.name}</td>
                      <td data-cy="ProductCategory">
                        {category.icon} - {category.title}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={
                          user.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                        }
                      >
                        {user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
