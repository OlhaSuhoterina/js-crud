// Підключаємо технологію express для back-end сервера
const express = require('express')
const { compile } = require('morgan')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

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

// +++++++++++++++++++++++++++Purchase+++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++Purchase+++++++++++++++++++++++++++++
class PurchaseProduct {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    caterory,
    price,
    amount = 0,
  ) {
    this.id = ++PurchaseProduct.#count
    this.img = img
    this.title = title
    this.description = description
    this.caterory = caterory
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newPurchaseProduct = new PurchaseProduct(...data)
    this.#list.push(newPurchaseProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    return shuffledList.slice(0, 3)
  }
}

PurchaseProduct.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  27000,
  10,
)

PurchaseProduct.add(
  'https://picsum.photos/200/300',
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  17000,
  10,
)

PurchaseProduct.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  113109,
  10,
)

PurchaseProduct.add(
  'https://picsum.photos/200/300',
  `2Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  27000,
  10,
)

PurchaseProduct.add(
  'https://picsum.photos/200/300',
  `2Комп'ютер CORA Advanced (I11F.8.H1S2.15T.1335) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  1700000,
  10,
)

PurchaseProduct.add(
  'https://picsum.photos/200/300',
  `2Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  113109,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonucAmount = (totalPrice) => {
    return totalPrice * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonucAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updateBalance = currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updateBalance)

    console.log(email, updateBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname
    this.phone = data.phone
    this.email = data.email
    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  static add = (...data) => {
    const newPurchase = new Purchase(...data)

    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse()
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)
// ================================================================
router.get('/purchase', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-alert',

    data: {
      message: `Операція успішна`,
      info: `Замовлення успішно було створено`,
      linl: `/purchase`,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/purchase-index', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',

    data: {
      list: PurchaseProduct.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',

    data: {
      list: PurchaseProduct.getRandomList(id),
      product: PurchaseProduct.getById(id),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  console.log(id, amount)

  if (amount < 1) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }
  const product = PurchaseProduct.getById(id)

  // ????amount???

  if (product.amount < 1) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Немає такої кількості товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonucAmount(totalPrice)

  res.render('purchase-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-create',

    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,

    promocode,
    bonus,
    comment,
  } = req.body

  const product = PurchaseProduct.getById(id)
  console.log(product)

  if (!product) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  if (product.amount < amount) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: 'Помилка',
        info: 'Товару немає в потрібной кількості',
        link: `/purchase-list`,
      },
    })
  }
  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        link: `/purchase-list`,
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: `Заповнить обов'язкові поля`,
        info: 'Некоректні дані',
        link: `/purchase-list`,
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      comment,
    },
    product,
  )
  console.log(purchase)

  res.render('purchase-alert', {
    style: 'purchase-alert',

    data: {
      message: 'Успішно',
      info: 'Замовлення створене',
      link: `/purchase-list`,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ==============================================

router.get('/purchase-list', function (req, res) {
  const list = Purchase.getList()
  // const product = PurchaseProduct.getById(id)

  console.log(Purchase.getList())

  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-list',

    data: {
      purchases: {
        list,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ==============================================
router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)

  const purchase = Purchase.getById(id)

  const bonus = Purchase.calcBonucAmount(
    purchase.totalPrice,
  )

  res.render('purchase-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-info',
    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      delivery: purchase.delivery,
      product: purchase.product.title,
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      totalPrice: purchase.totalPrice,
      bonus: bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ==============================================
router.get('/purchase-edit', function (req, res) {
  const id = Number(req.query.id)
  console.log(id)
  const purchase = Purchase.getById(id)
  // console.log(purchase)

  res.render('purchase-edit', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-edit',
    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ==============================================
router.post('/purchase-update', function (req, res) {
  const id = Number(req.query.id)
  const { firstname, lastname, phone, email } = req.body
  console.log(id)

  const purchase = Purchase.getById(id)

  const result = Purchase.updateById(purchase, {
    firstname,
    lastname,
    phone,
    email,
  })
  console.log(firstname, lastname, phone, email)
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-alert',

    data: {
      message: `Операція успішна`,
      info: `Замовлення успішно було змінено`,
      link: `/purchase-list`,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ==============================================
// ======================sportify========================

class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getByID = (id) => {
    return this.#list.find((track) => track.id === id)
  }
}

Track.create(
  'Інь Ян',
  'Monatik і Roxolana',
  'https://picsum.photos/100/100',
)

Track.create(
  'Miracle',
  'Julian Perretta',
  'https://picsum.photos/100/100',
)

Track.create(
  'Мрія',
  'Brosko Feat. Alyona (On I Ona)',
  'https://picsum.photos/100/100',
)

Track.create(
  'NA KRYLAH ZHITTYA',
  'SONYA KAY',
  'https://picsum.photos/100/100',
)

Track.create(
  'Physical',
  'Dua Lipa',
  'https://picsum.photos/100/100',
)

Track.create(
  'СТРАННАЯ',
  'MAX BARSKIH',
  'https://picsum.photos/100/100',
)

Track.create(
  'VSTAVAI',
  'YAKTAK',
  'https://picsum.photos/100/100',
)
console.log(Track.getList())

class Playlist {
  static #list = []
  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .splice(0, 3)
    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find((playlist) => playlist.id) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }
  addTrack(trackId) {
    this.#list.push(trackId)
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

// // ==============================================

// ==============================================

router.get('/spotify-choose', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',

    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
}) // ==============================================

// ==============================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  console.log(isMix)
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
  // ↑↑ сюди вводимо JSON дані
}) // ==============================================

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',

      data: {
        message: 'Помилка',
        info: 'Введить назву плейліста',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }
  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ==============================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: '/spotify-choose',
      },
    })
  }

  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ==============================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }
  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ==============================================

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)

  const playlist = Playlist.getById(playlistId)
  const allTracks = Track.getList()
  console.log(playlistId, playlist)

  res.render('spotify-playlist-add', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist-add',

    data: {
      playlistId: playlist.id,
      tracks: allTracks,
      link: `/spotify-track-add?playlistId={{playlistId}}&trackId =={{id}}`,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ==============================================

router.post('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }
  const trackToAdd = Track.getList().find(
    (track) => track.id === trackId,
  )

  playlist.tracks.push(trackToAdd)

  res.render('spotify-track-add', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-track-add',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ==============================================
router.get('/spotify-index', function (req, res) {
  // res.render генерує нам HTML сторінку
  const playlistId = Number(req.query.playlistId)

  const playlist = Playlist.getById(playlistId)
  // const track = playlist.tracks.length

  const list = Playlist.getList()
  // console.log(playlist, playlist.tracks.length)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-index',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),

      isEmply: list.length === 0,
    },
  })
  // ↑↑ сюди вводимо JSON дані
}) // ==============================================

// ==============================================
router.get('/spotify-search', function (req, res) {
  const value = ''
  const list = Playlist.findListByValue(value)
  console.log(list)
  res.render('spotify-search', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),

      value,
    },
  })
})

Playlist.makeMix(Playlist.create('Test'))
// ==============================================
// ==============================================
router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''
  const list = Playlist.findListByValue(value)
  console.log(value)
  res.render('spotify-search', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),

      value,
    },
  })
})

// ==============================================
// Підключаємо роутер до бек-енду
module.exports = router
