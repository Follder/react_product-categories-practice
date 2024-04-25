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

const USERS_FILTER = usersFromServer.map(user => user.name);

USERS_FILTER.unshift('All');

const visibleGoods = [...products];

export const App = () => (
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
                data-cy={user[i] === user[0] ? 'FilterAllUsers' : 'FilterUser'}
                href="#/"
                className={cn('', { 'is-active': true })}
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
                value="qwe"
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
                />
              </span>
            </p>
          </div>

          <div className="panel-block is-flex-wrap-wrap">
            <a
              href="#/"
              data-cy="AllCategories"
              className="button is-success mr-6 is-outlined"
            >
              All
            </a>

            <a
              data-cy="Category"
              className="button mr-2 my-1 is-info"
              href="#/"
            >
              Category 1
            </a>

            <a data-cy="Category" className="button mr-2 my-1" href="#/">
              Category 2
            </a>

            <a
              data-cy="Category"
              className="button mr-2 my-1 is-info"
              href="#/"
            >
              Category 3
            </a>
            <a data-cy="Category" className="button mr-2 my-1" href="#/">
              Category 4
            </a>
          </div>

          <div className="panel-block">
            <a
              data-cy="ResetAllButton"
              href="#/"
              className="button is-link is-outlined is-fullwidth"
            >
              Reset all filters
            </a>
          </div>
        </nav>
      </div>

      <div className="box table-container">
        <p data-cy="NoMatchingMessage">
          No products matching selected criteria
        </p>

        <table
          data-cy="ProductTable"
          className="table is-striped is-narrow is-fullwidth"
        >
          <thead>
            <tr>
              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  ID
                  <a href="#/">
                    <span className="icon">
                      <i data-cy="SortIcon" className="fas fa-sort" />
                    </span>
                  </a>
                </span>
              </th>

              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  Product
                  <a href="#/">
                    <span className="icon">
                      <i data-cy="SortIcon" className="fas fa-sort-down" />
                    </span>
                  </a>
                </span>
              </th>

              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  Category
                  <a href="#/">
                    <span className="icon">
                      <i data-cy="SortIcon" className="fas fa-sort-up" />
                    </span>
                  </a>
                </span>
              </th>

              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  User
                  <a href="#/">
                    <span className="icon">
                      <i data-cy="SortIcon" className="fas fa-sort" />
                    </span>
                  </a>
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleGoods.map(good => {
              return (
                <tr data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    1
                  </td>

                  <td data-cy="ProductName">Milk</td>
                  <td data-cy="ProductCategory">🍺 - Drinks</td>

                  <td data-cy="ProductUser" className="has-text-link">
                    Max
                  </td>
                </tr>
              );
            })}
            <tr data-cy="Product">
              <td className="has-text-weight-bold" data-cy="ProductId">
                1
              </td>

              <td data-cy="ProductName">Milk</td>
              <td data-cy="ProductCategory">🍺 - Drinks</td>

              <td data-cy="ProductUser" className="has-text-link">
                Max
              </td>
            </tr>

            <tr data-cy="Product">
              <td className="has-text-weight-bold" data-cy="ProductId">
                2
              </td>

              <td data-cy="ProductName">Bread</td>
              <td data-cy="ProductCategory">🍞 - Grocery</td>

              <td data-cy="ProductUser" className="has-text-danger">
                Anna
              </td>
            </tr>

            <tr data-cy="Product">
              <td className="has-text-weight-bold" data-cy="ProductId">
                3
              </td>

              <td data-cy="ProductName">iPhone</td>
              <td data-cy="ProductCategory">💻 - Electronics</td>

              <td data-cy="ProductUser" className="has-text-link">
                Roma
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);