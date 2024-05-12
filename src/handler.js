const { nanoid } = require('nanoid');
const books = require('./books')

const addBookHandler = (request, h) => {
    // mengatur dan mengabil data dari payload
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    let finished = false;
    if(pageCount === readPage){
        finished = true;
    }
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // untuk object books nya dan isi data tadi
    const newBooks = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    // menambahkan object newBooks ke dalam array Books
    books.push(newBooks);

    // cek apakah succes (cek ada tidaknya book didalam array books dengan id book yg ditambahkan)
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    // cek response dan return kan response itu beserta isi responsenya
    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
}

const getAllBooksHandler = (request, h) => {

    const { reading } = request.query;
    const { finished } = request.query;
    const { name } = request.query;

    if(reading !== undefined){
        if(reading === '1'){
            const book = books.filter((b) => b.reading === true);
            const bookfiltered = []
            book.forEach(book => {
                bookfiltered.push({"id" : book.id, "name" : book.name, "publisher" : book.publisher})
            });
            const response = h.response({
                status: 'success',
                data: {
                    books : bookfiltered,
                },
            });
            response.code(200);
            return response;
        }else{
            const book = books.filter((b) => b.reading === false);
            const bookfiltered = []
            book.forEach(book => {
                bookfiltered.push({"id" : book.id, "name" : book.name, "publisher" : book.publisher})
            });
            const response = h.response({
                status: 'success',
                data: {
                    books : bookfiltered,
                },
            });
            response.code(200);
            return response;
        }

    }else if(finished !== undefined){
        if(finished === '1'){
            const book = books.filter((b) => b.finished === true);
            const bookfiltered = []
            book.forEach(book => {
                bookfiltered.push({"id" : book.id, "name" : book.name, "publisher" : book.publisher})
            });
            const response = h.response({
                status: 'success',
                data: {
                    books : bookfiltered,
                },
            });
            response.code(200);
            return response;
        }else{
            const book = books.filter((b) => b.finished === false);
            const bookfiltered = []
            book.forEach(book => {
                bookfiltered.push({"id" : book.id, "name" : book.name, "publisher" : book.publisher})
            });
            const response = h.response({
                status: 'success',
                data: {
                    books : bookfiltered,
                },
            });
            response.code(200);
            return response;
        }
    }else if(name !== undefined){
        if(name.toLowerCase().includes("dicoding")){
            const book = books.filter((b) => b.name.toLowerCase().includes("dicoding") === true);
            const bookfiltered = []
            book.forEach(book => {
                bookfiltered.push({"id" : book.id, "name" : book.name, "publisher" : book.publisher})
            });
            const response = h.response({
                status: 'success',
                data: {
                    books : bookfiltered,
                },
            });
            response.code(200);
            return response;
        }
    }

    const bookfiltered = []
    books.forEach(book => {
        bookfiltered.push({"id" : book.id, "name" : book.name, "publisher" : book.publisher})
    });
    const response = h.response({
        status: 'success',
        data: {
            books : bookfiltered,
        },
    });
    response.code(200);
    return response;
}

const getBookByIdHandler = (request, h) => {
    // ambil nilai bookid di parameter routes
    const { bookid } = request.params;

    // ambil book dengan id tersebut
    const book = books.filter((b) => b.id === bookid)[0];

    // cek jika memang ada book dengan id tersebut (cek tidak undefined)
    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
}

const editBookByIdHandler = (request, h) => {
    // ambil id dari paramater routes
    const { bookid } = request.params;
    // ambil title,tags, body dari payload karena method PUT dan biasanya akan mengirin JSON
    const { name, year, author, summary, publisher, pageCount, readPage, reading, } = request.payload;
    const updatedAt = new Date().toISOString();

    let finished = false;
    if(pageCount === readPage){
        finished = true;
    }

    // cek apakah ada nama di payload
    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    // cek apakah idnya benar
    const index = books.findIndex((book) => book.id === bookid);

    if (index !== -1) {
        books[index] = {
          // ambil semua key dulu dari books ini (ini hanya ambil key)
          ...books[index],
          // lalu isi value nya dengan data baru yg telah diambil tadi
          name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt
        };
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

const deleteBookByIdHandler = (request, h) => {
    const { bookid } = request.params;
    const index = books.findIndex((book) => book.id === bookid);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;

}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
