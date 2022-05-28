//Book class to represent a book
class Book {
    constructor(title,author,isbn){
        this.author = author;
        this.title = title;
        this.isbn = isbn;
    }
}

//UI class to handle UI tasks
class UI {
    static displayBooks() {

    const books = Store.getBooks();

    books.forEach((book)=>{
        UI.addBookToList(book)
    })
    }
    static addBookToList(book) {
        const list = document.getElementById('book-list')
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>
        `
        list.appendChild(row)
    }

    //deleting bookk
    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert(message,className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(div,form)

        //removing after 3 seconds
        setTimeout(()=>{
            document.querySelector('.alert').remove()
        },3000)
    }

    static clearField() {
        document.querySelector('#title').value = ""
        document.querySelector('#author').value = ""
        document.querySelector('#isbn').value = ""
        document.querySelector('#title').focus()
    }
}

//Store class to take care of storage, in this case local storage
class Store {
    static getBooks(){
        let books
        if(localStorage.getItem('books') === null) {
            books = []
        } else {
            //it is stored as string so passing it through JSON.parse so we are converting it into an array of object
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books
    }

    static addBooks(book){
        const books = Store.getBooks()
        books.push(book)
        //saving items in storage
        //JSON.stringify converting array of objects into string
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBooks(isbn){
        const books = Store.getBooks()

        books.forEach((book,index) => {
            if(book.isbn === isbn) {
                books.splice(index,1)
            }
        })

        localStorage.setItem('books',JSON.stringify(books))
    }
}

//Event to display books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

//Event to add a book
document.querySelector('#book-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    //get form values
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    //validation
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill all input fields', 'danger')
    } else{        
    //instatiate book
    const book = new Book(title,author,isbn)

    //add book to UI
    UI.addBookToList(book)

    //add book to store
    Store.addBooks(book)

    //success message
    UI.showAlert('Book added','success')

    //clear input fields
    UI.clearField()
    }
})

//Event to remove a book with event propagation
document.querySelector('#book-list').addEventListener('click',(e) => {
    //removing book from UI
    UI.deleteBook(e.target)

    //deleting from localStorage
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent)

    //alert message to remove book
    UI.showAlert('Book added','success')
})