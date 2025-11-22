import React, { useState } from 'react';
import { getContract, parseEther } from '../lib/eth';
import { uploadToLighthouse } from '../lib/ipfs';
import styles from "../styles/SellForm.module.css";

const CATEGORIES = [
  "Action & Adventure",
  "Ad Icons",
  "Animated TV",
  "Animation",
  "Animation & Cartoons",
  "Anime",
  "Anime & Manga",
  "Cartoons",
  "Classics",
  "Comedy",
  "Comics & Superheroes",
  "Crime & Drama",
  "Family",
  "Fan Favorites",
  "Fantasy",
  "Funko Originals",
  "Horror",
  "Manga",
  "Music",
  "Public Figures",
  "Retro Toys",
  "Romance",
  "SciFi",
  "Seasonal",
  "Sports",
  "Video Games"
];

const LICENSES = [
  "1883",
  "Abbott Elementary",
  "Abigail",
  "AC/DC",
  "Aerosmith",
  "Aggretsuko",
  "Alien",
  "Alien vs. Predator",
  "Animaniacs",
  "Annabelle",
  "Army of Darkness",
  "Astro Bot",
  "Attack on Titan",
  "Avatar",
  "Avril Lavigne",
  "Back to the Future",
  "Baldur's Gate",
  "Barbie",
  "Barney",
  "Battlestar Galactica",
  "Beavis and Butthead",
  "Beetlejuice",
  "Beverly Hills, 90210",
  "Bleach",
  "Bloodsport",
  "Bob's Big Boy",
  "Bob's Burgers",
  "Bon Jovi",
  "Borderlands",
  "Breakfast Club",
  "Bridgerton",
  "Britney Spears",
  "Bruce Lee",
  "BTS",
  "Buffy the Vampire Slayer",
  "Care Bears",
  "Cartoon Network",
  "Casper the Friendly Ghost",
  "Castlevania",
  "Chainsaw Man",
  "Charmed",
  "Chucky",
  "Clueless",
  "Coraline",
  "Cry-Baby",
  "Dandadan",
  "DC Comics",
  "Delicious in Dungeon",
  "Demon Slayer",
  "Despicable Me",
  "Dexter",
  "Diablo",
  "Día de los Muertos",
  "Disney",
  "Doja Cat",
  "Dr. Seuss",
  "Dragon Ball",
  "Dune",
  "Dungeons & Dragons",
  "Elvira, Mistress of the Dark",
  "Emily in Paris",
  "Fallout",
  "FC Barcelona",
  "Ferris Bueller",
  "Ferxxo",
  "Firefly",
  "Fisher-Price",
  "Five Nights at Freddy's",
  "Friday the 13th",
  "Friends",
  "Frieren: Beyond Journey's End",
  "Funko",
  "Futurama",
  "Game of Thrones",
  "Ghost",
  "Ghostbusters",
  "Godzilla",
  "Goodfellas",
  "Goosebumps",
  "Gravity Falls",
  "Gremlins",
  "Gundam",
  "Guns N Roses",
  "Hanna-Barbera",
  "Hannibal",
  "Harry Potter",
  "Hazbin Hotel",
  "Home Alone",
  "House",
  "House of 1000 Corpses",
  "House of the Dragon",
  "How to Train Your Dragon",
  "Hunter x Hunter",
  "Ice Spice",
  "Insidious",
  "Inuyasha",
  "Invincible",
  "Iron Maiden",
  "IT",
  "Jem and the Holograms",
  "John Wick",
  "JoJo's Bizarre Adventure",
  "Juan Gabriel",
  "Jujutsu Kaisen",
  "Jurassic Park",
  "Jurassic World",
  "Kaiju No. 8",
  "Kellogg's",
  "Killer Klowns from Outer Space",
  "Kingdom Hearts",
  "King of the Hill",
  "KISS",
  "KPop Demon Hunters",
  "Lamb Chop",
  "League of Legends",
  "Liverpool",
  "Love Actually",
  "M3gan",
  "Magic: The Gathering",
  "Manchester City",
  "Manchester City F.C.",
  "Mars Attacks",
  "Marvel",
  "Masters of the Universe",
  "Mattel",
  "Mean Girls",
  "Mega Man",
  "Mercedes-AMG Petronas",
  "Metal Gear Solid",
  "Metallica",
  "Metaphor: ReFantazio",
  "Michael Jackson",
  "MLB",
  "MLS",
  "Monk",
  "Monster High",
  "Mortal Kombat",
  "Motel Hell",
  "MOUSE: P.I. For Hire",
  "My Hero Academia",
  "Naruto",
  "NBA",
  "NBA Mascots",
  "New Belgium",
  "NewJeans",
  "NFL",
  "NHL",
  "Nickelodeon",
  "Nightmare on Elm Street",
  "Nosferatu",
  "Notorious B.I.G",
  "Oasis",
  "One Piece",
  "Only Murders in the Building",
  "Oracle Red Bull Racing",
  "Ozzy Osbourne",
  "Parks and Recreation",
  "Peanuts",
  "Pink",
  "Pinky and The Brain",
  "Pixar",
  "Planes, Trains and Automobiles",
  "Planet of the Apes",
  "Pokémon",
  "Polly Pocket",
  "Pop Tarts",
  "Powerless",
  "Power Rangers",
  "Predator",
  "Pretty in Pink",
  "Queen",
  "Rainbow Brite",
  "Ranma 1/2",
  "Re:ZERO − Starting Life in Another World",
  "Rear Window",
  "Reba McEntire",
  "Red Dawn",
  "Red One",
  "Rick and Morty",
  "Rob Zombie",
  "Rocky",
  "Rocky Horror Picture Show",
  "Rooster Fighter",
  "Sabrina Carpenter",
  "Sakamoto Days",
  "Sanrio",
  "Santa Claus is Comin' to Town",
  "Saturday Night Live",
  "Saved by the Bell",
  "Saw",
  "Say Anything",
  "Scooby-Doo",
  "Scream",
  "Senna",
  "Sesame Street",
  "Shaboozey",
  "Shrek",
  "Sixteen Candles",
  "Skibidi Toilet",
  "Sleepy Hollow",
  "Smile",
  "Solo Leveling",
  "Sonic The Hedgehog",
  "South Park",
  "Species",
  "Spy × Family",
  "Squid Game",
  "Stargate",
  "Star Trek",
  "Star Wars",
  "Stranger Things",
  "Suits",
  "Supernatural",
  "Superstore",
  "Tank Girl",
  "Teenage Mutant Ninja Turtles",
  "Terrifier",
  "The Addams Family",
  "The Beach Boys",
  "The Black Crowes",
  "The Black Phone",
  "The Conjuring",
  "The Electric State",
  "The Exorcist",
  "The Godfather",
  "The Golden Girls",
  "The Haunting of Hill House",
  "The Land Before Time",
  "The Lord of the Rings",
  "The Nun",
  "The Office",
  "The Secret of NIMH",
  "The Silence of the Lambs",
  "The Simpsons",
  "The Smurfs",
  "The Sopranos",
  "The Twilight Zone",
  "The White Lotus",
  "The Wire",
  "The Wizard of Oz",
  "Thundercats",
  "Tiger Woods",
  "Tokyo Revengers",
  "Tom and Jerry",
  "Tom Petty",
  "T-Pain",
  "Transformers",
  "Trick r Treat",
  "Tupac Shakur",
  "Ugly Betty",
  "Universal Monsters",
  "Us",
  "Veronica Mars",
  "Voltron",
  "Warner Bros.",
  "Where the Wild Things Are",
  "Wicked",
  "Winx Club",
  "WNBA",
  "World of Warcraft",
  "WWE",
  "Xena Warrior Princess",
  "Yellowstone",
  "Yu-Gi-Oh!"
];



export default function SellForm({ onCreated }) {
  const [form, setForm] = useState({ 
    nameFunko:"",
    nameCharacter:"",
    category:"",
    license:"",
    boxNumber:"",
    image:"", 
    price:"",
    isAuction: false,
    auctionDuration:""
  });

  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k,v)=>setForm(f=>({...f,[k]:v}));

  async function handleUpload() {
    try {
      setBusy(true);
      const cidUrl = await uploadToLighthouse(file); // ottieni ipfs://CID
      set("image", cidUrl);
      alert("Immagine caricata su Lighthouse!");
    } catch (e) {
      alert(e.message);
    } finally { setBusy(false); }
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const { BrowserProvider } = await import('ethers');
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = await getContract(signer);

      const priceWei = parseEther(form.price);
      const boxNumber = toString(form.boxNumber);

      if (!form.isAuction) {
        
        const tx = await c.createFunko(
          form.nameFunko,
          form.nameCharacter,
          form.image,
          form.category,
          form.license,
          boxNumber,
          priceWei
        );

        await tx.wait();
        onCreated?.();
        alert("Funko messo in vendita!");
      } 
      else {
        
        const durationSeconds = Number(form.auctionDuration) * 60;

        const tx = await c.createAuction(
          form.nameFunko,
          form.nameCharacter,
          form.image,
          form.category,
          form.license,
          boxNumber,
          priceWei,          // starting price in ETH → wei
          durationSeconds    // minuti → secondi
        );

        await tx.wait();
        onCreated?.();
        alert("Asta creata con successo!");
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }


  return (
    <form className={styles.card} onSubmit={submit}>
      <h3 className={styles.h3}>Vendi un Funko Pop</h3>

      {/*Nome Funko Pop*/}
      <input className={styles.input} placeholder="Nome Funko"
             value={form.nameFunko} onChange={e=>set('nameFunko', e.target.value)} required />
      
      {/*Nome Personaggio*/}
      <input className={styles.input} placeholder="Nome Personaggio"
             value={form.nameCharacter} onChange={e=>set('nameCharacter', e.target.value)} required />

      {/*Numero scatola*/}
      <input className={styles.input} placeholder="Numero scatola" type='number'
             value={form.boxNumber} onChange={e=>set('boxNumber', e.target.value)} required />

      {/*Categoria*/}
      <select className={styles.input} value={form.category} onChange={e => set("category", e.target.value)} required> 
      <option value="">Seleziona la categoria</option>
      {CATEGORIES.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
      </select>

      {/*Licenza*/}
      <select className={styles.input} value={form.license} onChange={e => set("license", e.target.value)} required> 
      <option value="">Seleziona la licenza</option>
      {LICENSES.map(lic => (
        <option key={lic} value={lic}>{lic}</option>
      ))}
      </select>

      {/*Immagine*/}
      <input className={styles.input} placeholder="Link immagine o ipfs://"
             value={form.image} onChange={e=>set('image', e.target.value)} />

      <div className={styles.row}>
          <input id="fileUpload" type="file" accept="image/*" 
           onChange={e => {setFile(e.target.files[0]);}} className={styles.nascondere}/>
          <label htmlFor="fileUpload" className={styles.btn}>Seleziona immagine</label>
          <span className={styles.nomeFile}>{file ? file.name : "Nessun file selezionato"}</span>

          <button type="button" className={styles.btn} disabled={!file || busy} onClick={handleUpload}>Carica su IPFS (Lighthouse)</button>
      </div>

      {/*Selezione tipologia di vendita*/}
      <div className={styles.row}>
        <div className={styles.sceltaWrap} role="radiogroup" aria-label="Modalità vendita">
          <label className={`${styles.scelta} ${!form.isAuction ? styles.sceltaAttivo : ''}`} onClick={() => set('isAuction', false)}>
              <input type="radio" name="mode" checked={!form.isAuction} readOnly />
              <svg className={styles.iconeScelta} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span className={styles.sceltaLabel}>Vendita</span>
          </label>

          <label className={`${styles.scelta} ${form.isAuction ? styles.sceltaAttivo : ''}`} onClick={() => set('isAuction', true)}>
            <input type="radio" name="mode" checked={form.isAuction} readOnly />
            <svg className={styles.iconeScelta} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381"/><path d="m16 16 6-6"/><path d="m21.5 10.5-8-8"/><path d="m8 8 6-6"/><path d="m8.5 7.5 8 8"/></svg>
            <span className={styles.sceltaLabel}>Asta</span>
          </label>
        </div>
      </div>

      <div className={styles.folder}> 
      
      {/* Se VENDITA NORMALE */}
      {!form.isAuction && (
        <div>
          <input className={styles.input} placeholder="Prezzo (ETH)" value={form.price} onChange={e => set("price", e.target.value)} required/>
          <button className={styles.btn} disabled={busy}>Crea annuncio</button>
        </div>
      )}
      {/* Se ASTA */}
      {form.isAuction && (
        <div>
          <input className={styles.input} placeholder="Prezzo di partenza (ETH)" value={form.price} onChange={e => set("price", e.target.value)} required/>
          <input className={styles.input} placeholder="Durata asta (minuti)" type="number" value={form.auctionDuration} onChange={e => set("auctionDuration", e.target.value)} required/>
          <button className={styles.btn} disabled={busy}>Crea annuncio</button>
        </div>
      )}
      </div>

      
    </form>
  );
}
