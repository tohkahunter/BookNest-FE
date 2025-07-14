// src/app/pages/BookDetail/models/bookData.js

export const mockBookData = {
  id: 9648068,
  title: "The First Days",
  subtitle: "As the World Dies, #1",
  author: {
    name: "Rhiannon Frater",
    id: 123456,
    photo: "https://images.goodreads.com/authors/1234567890p5/123456.jpg"
  },
  cover: "https://product.hstatic.net/200000301138/product/71418a942cd3034cb029ee888374a583_8da6b5ef2a094805ad5ceba1f30ec828.jpg",
  rating: {
    average: 4.12,
    count: 15847,
    distribution: {
      5: 6234,
      4: 5673,
      3: 2891,
      2: 876,
      1: 173
    }
  },
  description: `The wheels of destiny had turned, and a new reality was being spun into existence.

They had to keep calm. They had to keep strong. They had to survive. It was as easy as that.

"It's okay to cry now," Katie murmured. Jenni covered her face with her hands and wept. For her dead children, for the dead world, and for her newfound freedom…

Katie and Jenni have just witnessed the zombie apocalypse begin. Now they must flee their Texas town and find a safe place to make their last stand against the living dead.`,
  details: {
    pages: 331,
    format: "Paperback",
    published: "August 14, 2008",
    publisher: "Permuted Press",
    isbn: "978-1934861042",
    language: "English",
    series: "As the World Dies",
    seriesNumber: 1
  },
  genres: [
    "Horror",
    "Zombies", 
    "Post Apocalyptic",
    "Fiction",
    "Fantasy",
    "Urban Fantasy",
    "Science Fiction"
  ],
  reviews: [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.goodreads.com/users/1234567890p3/12345.jpg"
      },
      rating: 5,
      date: "March 15, 2024",
      text: "Absolutely gripping from start to finish! The character development is fantastic and the zombie apocalypse feels terrifyingly real."
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        avatar: "https://images.goodreads.com/users/1234567890p3/67890.jpg"
      },
      rating: 4,
      date: "February 28, 2024",
      text: "Great start to the series. The relationship between Katie and Jenni is the heart of the story."
    }
  ],
  relatedBooks: [
    {
      id: 9648069,
      title: "Fighting to Survive",
      author: "Rhiannon Frater",
      cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348617843i/9648069.jpg",
      description: "Katie and Jenni have found refuge with fellow survivors, but danger still looms. As the undead, bandits, and harsh elements close in, they must fight alongside their new community to stay alive in a dying world.",
      rating: 4.15,
      count: 12000,
    }
  ]
};

export default mockBookData;