# Отрисовка данных с сервера

`https://kitek.ktkv.dev/static/spotify.json`

## Цель:

Вам дана верстка. Ваша задача написать JavaScript код, который будет забирать данные с API

![logo](.repo/Screenshot%202025-09-11%20at%2008.57.23.png?v=1)

## Теория

### Пример одного элемента

```html
<li class="track-item">
    <div class="track-number">1</div>
    <div class="track-main">
        <img
            src="https://i.scdn.co/image/ab67616d000048516f51139efce47d2e01da8052"
            alt="плохохорошо"
            class="album-art"
            loading="lazy"
        />
        <div class="track-info">
            <div class="track-name">плохохорошо</div>
            <div class="track-artists">iskrit, ioneweb</div>
            <div class="track-album">плохохорошо</div>
        </div>
    </div>
    <div class="track-meta">
        <div class="duration">2:59</div>
        <div class="popularity">♪ 30</div>
    </div>
</li>
```

### Шаг 1: Получить JSON данные

```javascript
async function fetchData() {
    const data = await fetch('апишка')
    const json = await data.json()
    ...
}
```

### Шаг 2: Создать HTML структуру

```html
<div id="container"></div>
```

_У вас уже она есть_

### Шаг 3: Написать функцию рендеринга

```javascript
const container = document.getElementById("container")
container.innerHTML = `
<div class="card">
  <h2>${data.name}</h2>
  <p>Возраст: ${data.age}</p>
</div>
`
```

## 3. Работа с массивами данных

### Способ через createElement:

```javascript
items.forEach((item) => {
    const div = document.createElement("div")
    div.className = "item"
    div.innerHTML = `
  <h3>${item.title}</h3>
  <p>${item.description}</p>
`
    container.appendChild(div)
})
```

_можно через обычный for_

### Альтернативный способ через строку

```javascript
const html = items
    .map(
        (item) => `
    <div class="item">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
  `
    )
    .join("")

container.innerHTML = html
```

## 4. Обработка сложных структур

### Вложенные объекты:

```javascript
function renderProfile(user) {
    return `
    <div class="profile">
      <h2>${user.name}</h2>
      <div class="contacts">
        <p>Email: ${user.contacts.email}</p>
        <p>Телефон: ${user.contacts.phone}</p>
      </div>
      <div class="skills">
        ${user.skills
            .map((skill) => `<span class="tag">${skill}</span>`)
            .join("")}
      </div>
    </div>
  `
}
```

### Проверка на существование данных:

```javascript
function safeRender(data) {
    return `
    <div class="item">
      <h3>${data.title || "Без названия"}</h3>
      <p>${data.description || "Описание отсутствует"}</p>
      ${data.image ? `<img src="${data.image}" alt="${data.title}">` : ""}
    </div>
  `
}
```

## Как сдавать

1. Создайте форк репозитория в организации `41ISP` с названием `mobdev3-lab8-вашафамилия`
2. Используя ветку `wip` сделайте задание
3. Зафиксируйте изменения в вашем репозитории
4. Когда документ будет готов - создайте пул реквест из ветки `wip` (вашей) на ветку `main` (тоже вашу) и укажите меня ([ktkv419](https://github.com/ktkv419)) как reviewer

**Не мержите сами коммит**, это сделаю я после проверки задания
