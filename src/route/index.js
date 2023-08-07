// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
// ================================================================
class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password
  static add = (user) => {
    this.#list.push(user)
  }
  static getList = () => this.#list

  static getByID = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteByID = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateByID = (id, data) => {
    const user = this.getByID(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// =================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmply: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body
  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())
  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteByID(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  const user = User.getByID(Number(id))

  let result = false
  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  console.log(email, password, id)

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Email пошта оновлена'
      : 'Email пошта не оновлена',
  })
})

// ================================================================

// +++++++++++++++++++++++++++product+++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++product+++++++++++++++++++++++++++++

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = new Date().getTime()
  }

  static add = (product) => {
    this.#list.push(product)
  }
  static getList = () => this.#list

  static getByID = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteByID = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateByID = (id, data) => {
    const product = this.getByID(id)

    if (product) {
      this.update(product, data)

      return true
    } else {
      return false
    }
  }

  static update = (
    product,
    { name, price, description },
  ) => {
    if (name) {
      product.name = name
    }
    if (price) {
      product.price = price
    }
    if (description) {
      product.description = description
    }
  }
}

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product',

    data: {
      products: {
        list,
        isEmply: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)

  let result = false
  if (product) {
    Product.add(product)

    result = true
  }

  // console.log(Product.getList())
  res.render('alert', {
    style: 'alert',
    info: result ? 'Товар створено' : 'Виникла помилка',
  })
})

// // =======================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  let result = false
  if (id) {
    Product.deleteByID(Number(id))
    result = true
  }

  res.render('alert', {
    style: 'alert',
    info: result ? 'Товар видалено' : 'Виникла помилка',
  })
})

// // ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',

    data: {
      products: {
        list,
        isEmply: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-edit', function (req, res) {
  const { id, name, price, description } = req.query

  const product = Product.getByID(Number(id), {
    name,
    price,
    description,
  })

  console.log(product)

  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-edit', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-edit',

    data: {
      id,
      name,
      price,
      description,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body

  const product = Product.getByID(Number(id))

  const result = Product.update(product, {
    name,
    price,
    description,
  })

  console.log(name, price, description, id)

  res.render('alert', {
    style: 'alert',
    info: 'Товар оновлено',
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
