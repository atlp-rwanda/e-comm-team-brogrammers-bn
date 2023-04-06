--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Blockedtokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Blockedtokens" (
    id integer NOT NULL,
    token character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Blockedtokens" OWNER TO postgres;

--
-- Name: Blockedtokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Blockedtokens_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Blockedtokens_id_seq" OWNER TO postgres;

--
-- Name: Blockedtokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Blockedtokens_id_seq" OWNED BY public."Blockedtokens".id;


--
-- Name: Chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Chat" (
    id uuid NOT NULL,
    room character varying(255) NOT NULL,
    message character varying(10000) NOT NULL,
    "userId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Chat" OWNER TO postgres;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    products jsonb[],
    total double precision,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(2000) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    "receiverId" uuid,
    "isRead" boolean DEFAULT false,
    message character varying(255),
    type character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    "deliveryCountry" character varying(255) NOT NULL,
    "deliveryCity" character varying(255) NOT NULL,
    "deliveryStreet" character varying(255) NOT NULL,
    "buyerId" uuid NOT NULL,
    id uuid NOT NULL,
    "paymentMethod" character varying(255),
    "isPaid" boolean DEFAULT false NOT NULL,
    status character varying(255) DEFAULT 'Pending'::character varying NOT NULL,
    "totalAmount" numeric,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- Name: orderitem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderitem (
    quantity integer DEFAULT 0 NOT NULL,
    "productId" uuid NOT NULL,
    "orderId" uuid NOT NULL,
    price double precision NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE public.orderitem OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    amount double precision NOT NULL,
    "orderId" uuid,
    method character varying(255),
    discount double precision DEFAULT '0'::double precision,
    "stripeId" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid NOT NULL,
    images character varying(255)[],
    name character varying(255) NOT NULL,
    description character varying(2000),
    quantity integer NOT NULL,
    "sellerId" uuid NOT NULL,
    exp_date timestamp with time zone NOT NULL,
    available boolean DEFAULT true,
    price double precision DEFAULT '0'::double precision NOT NULL,
    category integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid NOT NULL,
    "productId" uuid,
    "userId" uuid,
    feedback text,
    rating integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    avatar character varying(1000) DEFAULT 'https://t3.ftcdn.net/jpg/01/28/56/34/360_F_128563455_bGrVZnfDCL0PxH1sU33NpOhGcCc1M7qo.jpg'::character varying,
    cover_image character varying(1000) DEFAULT 'https://cdn.conceptartempire.com/images/360/01-concept-art-video-game-item-shop.jpg'::character varying,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'buyer'::character varying,
    gender character varying(255) DEFAULT 'none'::character varying,
    verified boolean DEFAULT false,
    email_token text,
    "isEmailVerified" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "mustUpdatePassword" boolean DEFAULT false,
    "lastTimePasswordUpdated" timestamp with time zone DEFAULT '2023-04-05 20:05:06.321+02'::timestamp with time zone,
    "resetPasswordToken" character varying(255),
    "resetPasswordExpires" timestamp with time zone,
    mfa_enabled boolean DEFAULT false,
    "disabledUser" boolean DEFAULT false,
    mfa_code integer,
    mfa_timeout timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlists (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "productId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.wishlists OWNER TO postgres;

--
-- Name: Blockedtokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Blockedtokens" ALTER COLUMN id SET DEFAULT nextval('public."Blockedtokens_id_seq"'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Data for Name: Blockedtokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Blockedtokens" (id, token, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Chat" (id, room, message, "userId", "createdAt", "updatedAt") FROM stdin;
dd1d6729-47d9-4868-8993-16ef727db193	brogrammers	Distinctio ea vero libero enim. Incidunt libero asperiores optio sunt ex.	68d3b3cc-eee2-43f0-a416-17f644fb1445	2023-01-03 04:44:17.652+02	2023-01-03 04:44:17.652+02
ff76d5b8-b1f8-4f9f-b95d-996a47905abb	brogrammers	Qui doloremque magni consectetur. Dolorum quia ipsum quae tempore aliquid. Harum quo sequi aliquam. Temporibus facilis reprehenderit suscipit incidunt praesentium. Placeat dicta ullam nihil consectetur commodi quasi culpa quaerat eligendi. Debitis ipsa expedita error officiis alias.	6d233886-bae9-4ae6-abeb-9d3eae438085	2023-01-30 06:26:33.542+02	2023-01-30 06:26:33.542+02
3dc68a03-f0c6-43a2-b1de-86a9b549c9bb	brogrammers	Officia corrupti consequatur labore ut accusamus molestiae voluptates nam. Quo inventore unde accusamus. Eveniet nisi harum numquam blanditiis.	2abaa705-cc0c-444c-9bb8-2785abad8753	2022-08-13 18:46:48.464+02	2022-08-13 18:46:48.464+02
d630a22b-7820-4c28-88b2-fca1f1ae727f	brogrammers	Tempora magni corporis nostrum vitae. Ut quia nisi.	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	2023-01-25 20:06:16.471+02	2023-01-25 20:06:16.471+02
14831e82-50f0-49f7-b27c-d0dfb2a56d31	brogrammers	Harum optio inventore tempora sunt velit neque rerum dignissimos a. Dolorum quas nemo sequi.	6d233886-bae9-4ae6-abeb-9d3eae438085	2023-01-21 19:23:48.771+02	2023-01-21 19:23:48.771+02
bb0b4f84-c260-4cc9-acce-92f57e346c89	brogrammers	Dicta voluptates sunt quis. Eius labore provident sunt deleniti quaerat cum ipsum. Placeat iusto sit reprehenderit error quae reiciendis perferendis accusamus.	2abaa705-cc0c-444c-9bb8-2785abad8753	2022-10-16 18:06:22.928+02	2022-10-16 18:06:22.928+02
9185c591-73e1-4f8e-a078-3745fa7d3dbc	brogrammers	Tenetur inventore illo eveniet aliquid autem. Nemo iusto sint accusantium explicabo beatae doloribus recusandae. Iure quam at fuga minus sequi eligendi quasi autem animi. Totam distinctio dolores officiis distinctio optio. Sint facere cumque commodi itaque ullam perferendis magni reprehenderit dolore.	2abaa705-cc0c-444c-9bb8-2785abad8753	2023-01-14 11:45:18.975+02	2023-01-14 11:45:18.975+02
314aa5bb-ffd8-40f7-b470-cc72cfdc0a2a	brogrammers	Qui facere quasi quaerat aliquid. Incidunt quos ad iusto rerum nobis consequatur quasi. Dignissimos nobis possimus. Voluptatem atque non dignissimos impedit. Ipsam consectetur mollitia perferendis accusamus. Eveniet aliquam odit nobis commodi mollitia ducimus.	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	2022-05-09 22:16:53.163+02	2022-05-09 22:16:53.163+02
2b6c96ed-3737-4331-ab6b-d79745910686	brogrammers	Alias in quidem. Atque minima saepe accusantium neque ducimus deserunt quibusdam omnis eligendi. Perferendis id eveniet labore tenetur. Eveniet velit quaerat optio ipsum tempore autem in. Suscipit sed accusantium dolorem sunt maxime facilis suscipit natus necessitatibus.	2abaa705-cc0c-444c-9bb8-2785abad8753	2022-06-12 01:01:18.029+02	2022-06-12 01:01:18.029+02
317d7e3e-5756-4a14-bddd-3c2a5d2823b2	brogrammers	Consequatur asperiores quam quis earum. Quaerat voluptas autem nostrum cupiditate aliquid dolores iusto blanditiis. Modi vitae temporibus eos et molestiae facere. Quasi possimus neque eius aliquam dolor iusto vel iusto.	68d3b3cc-eee2-43f0-a416-17f644fb1445	2022-08-13 09:58:07.207+02	2022-08-13 09:58:07.207+02
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20230308210129-create-users.js
20230314092003-add_mfa_code_to_users_table.js
20230315075814-create-category.js
20230315082056-create-products.js
20230318201904-wishlist-table.js
20230318212731-cart-table.js
20230319204639-create-review.js
20230322072543-create-chat.js
20230323110332-create-order.js
20230323111021-create-order-item.js
20230326185144-create-blockedtoken.js
20230326193627-notifications-table.js
20230329063942-create-payment.js
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, "userId", products, total, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, title, description, "createdAt", "updatedAt") FROM stdin;
1	Consumer products	A consumer product is a finished product available for sale to a customer. There's a wide range of consumer products, and in marketing, they're typically divided into different types.	2023-04-05 20:05:12.782+02	2023-04-05 20:05:12.782+02
2	Industrial products	Businesses usually purchase an industrial product to make other products or to help them with running their business. An item that would be a consumer product if a customer bought it, such as cleaning supplies, may become an industrial product if a business buys it.	2023-04-05 20:05:12.782+02	2023-04-05 20:05:12.782+02
3	Service products	Service products are business offerings that are either a pure service or a core service. A pure service is a service without a tangible result, such as education, while a core service has a tangible result, like cleaning services. Some product categorizations place service products under industry products, but they can be their own type of product because many are available to consumers directly.	2023-04-05 20:05:12.782+02	2023-04-05 20:05:12.782+02
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "receiverId", "isRead", message, type, "createdAt", "updatedAt") FROM stdin;
a40c9d29-7259-4f11-9f25-b4a9afe79506	6d233886-bae9-4ae6-abeb-9d3eae438085	f	syndicate woman Berkshire Metal once South Liaison West portals Functionality	news	2023-04-05 20:05:12.942+02	2023-04-05 20:05:12.942+02
808c3fb4-d74b-43fa-b28d-fbf03730b92c	6d233886-bae9-4ae6-abeb-9d3eae438085	f	blockchains Rolls models Avon El bus Station Dodge salmon Northeast	news	2023-04-05 20:05:12.942+02	2023-04-05 20:05:12.942+02
07e60b46-f4f6-44d3-a108-57616231a3ab	6d233886-bae9-4ae6-abeb-9d3eae438085	f	Gold Sudanese Rustic B2B Wagon system minus connecting Belarus parsing	products	2023-04-05 20:05:12.943+02	2023-04-05 20:05:12.943+02
b4c8bdab-6022-4fc9-b389-89a2e6899a88	6d233886-bae9-4ae6-abeb-9d3eae438085	f	ratione Convertible Donald Account kelvin familiar Omnigender Ergonomic deposit strictly	news	2023-04-05 20:05:12.943+02	2023-04-05 20:05:12.943+02
ceb59671-b0ae-4e14-b150-e2ef3755238d	6d233886-bae9-4ae6-abeb-9d3eae438085	f	ubiquitous second interfaces now Tools Customer quantifying total Murrieta Pennsylvania	updates	2023-04-05 20:05:12.943+02	2023-04-05 20:05:12.943+02
9abdd8ac-90a8-43dd-b4b4-b51dca8ddd35	6d233886-bae9-4ae6-abeb-9d3eae438085	f	Home Escondido Northeast Regional Toys Garden required Analyst lavender female	payment	2023-04-05 20:05:12.943+02	2023-04-05 20:05:12.943+02
8f69a88a-4918-430c-9464-ef4b9167b170	6d233886-bae9-4ae6-abeb-9d3eae438085	f	Electronic withdrawal Cruiser JSON Arkansas Hat Bugatti Engineer deconsecrate East	payment	2023-04-05 20:05:12.943+02	2023-04-05 20:05:12.943+02
9f192d09-ae88-4945-b9e2-b39b65637904	6d233886-bae9-4ae6-abeb-9d3eae438085	f	zowie henry abnormally speedily Hybrid model Berkshire whether Programmable Functionality	products	2023-04-05 20:05:12.944+02	2023-04-05 20:05:12.944+02
722a5374-7031-4880-8635-482f85ac6655	6d233886-bae9-4ae6-abeb-9d3eae438085	f	knowledge Neodymium Data Hybrid Llewellyn generating IP Krona onto Account	news	2023-04-05 20:05:12.944+02	2023-04-05 20:05:12.944+02
00b87814-1e90-4190-8107-7c264b0423c2	6d233886-bae9-4ae6-abeb-9d3eae438085	f	female Credit verbally transmitting whiteboard cub payment Tandem Home vaguely	updates	2023-04-05 20:05:12.944+02	2023-04-05 20:05:12.944+02
4cd12217-fbb4-4ee8-bef8-b6d456c85ddd	6d233886-bae9-4ae6-abeb-9d3eae438085	f	TCP Persistent oh Analyst plum Praseodymium Vermont Electronic teal moderator	news	2023-04-05 20:05:12.944+02	2023-04-05 20:05:12.944+02
54506e4c-db70-4b8e-99b8-84b6c8c0b729	6d233886-bae9-4ae6-abeb-9d3eae438085	f	accidentally Sedan transition Hybrid Corporate male Audi microchip Agent Gasoline	news	2023-04-05 20:05:12.944+02	2023-04-05 20:05:12.944+02
bb7582a2-cd32-4e6d-9d2c-5783331e2c80	6d233886-bae9-4ae6-abeb-9d3eae438085	f	gold South West Rap Minnesota Account Northwest Classical Buckinghamshire Strategist	news	2023-04-05 20:05:12.944+02	2023-04-05 20:05:12.944+02
94d2d162-8f4f-4f8f-a32a-b58a868612f9	6d233886-bae9-4ae6-abeb-9d3eae438085	f	World Bicycle Northwest indigo Diesel Strategist likewise Nissan Trans Granite	products	2023-04-05 20:05:12.944+02	2023-04-05 20:05:12.944+02
2f551ab0-4565-4f60-81c1-59d42afc1a64	6d233886-bae9-4ae6-abeb-9d3eae438085	f	calculate male lavender Skokie transmitting outface Gender Accountability Bugatti Convertible	payment	2023-04-05 20:05:12.945+02	2023-04-05 20:05:12.945+02
3e81f627-018e-4335-b2f8-ff42fb090e12	6d233886-bae9-4ae6-abeb-9d3eae438085	f	Small down Loaf synergies capacitor Music quantify Mobility Chicken plum	products	2023-04-05 20:05:12.945+02	2023-04-05 20:05:12.945+02
77975872-9d86-4ca1-9a98-5a2256acfa3a	6d233886-bae9-4ae6-abeb-9d3eae438085	f	Central alarm Tricycle auxiliary payment 1080p Soul amet yellow Hybrid	news	2023-04-05 20:05:12.945+02	2023-04-05 20:05:12.945+02
3507eb5a-85cc-4ae0-8f75-8d182ff8451a	6d233886-bae9-4ae6-abeb-9d3eae438085	f	um calculate hard Southwest Santa Delaware cluttered atque firewall to	news	2023-04-05 20:05:12.945+02	2023-04-05 20:05:12.945+02
1bb056f0-7958-45b3-9ed7-6623bd95f9b2	6d233886-bae9-4ae6-abeb-9d3eae438085	f	Factors Bedfordshire National Garett Orchestrator engine housing Tennessee male indeed	updates	2023-04-05 20:05:12.945+02	2023-04-05 20:05:12.945+02
7169b9d0-39ee-4ddb-8f26-5f9495825d5c	6d233886-bae9-4ae6-abeb-9d3eae438085	f	airlift Future Kids waiver strategic Steel far infomediaries Rhode psychology	payment	2023-04-05 20:05:12.945+02	2023-04-05 20:05:12.945+02
666953a4-4290-4853-aa2d-182314b2b6ae	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	revolutionize Southeast Hill Hermaphrodite Chief asymmetric Rock 24/7 blind payment	products	2023-04-05 18:06:49.606+02	2023-04-05 18:06:49.606+02
18bf2dd2-4e82-4794-9dab-e03cda87fce4	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	Steel sensor Coupe reckless compressing deadly antiquity Bicycle wireless Sharable	products	2023-04-05 18:06:49.606+02	2023-04-05 18:06:49.606+02
80775c23-9370-4f1f-b71b-d9b07e63bbbf	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	plum North North application Hatchback Sao Car Gasoline SQL frame	news	2023-04-05 18:06:49.607+02	2023-04-05 18:06:49.607+02
52cd3322-23e5-4003-848a-59904c0802ae	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	junker Nauru indexing Account archive XSS reinvent Palmdale Avon Response	payment	2023-04-05 18:06:49.607+02	2023-04-05 18:06:49.607+02
e90fa56c-4157-405e-8940-0bfc0cc36a2a	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	quirky enhance communities up Jeep henry Fresh Bicycle Cab Electric	news	2023-04-05 18:06:49.607+02	2023-04-05 18:06:49.607+02
4089d034-8eb4-499a-847e-f822ee5a7781	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	Androgynous Plastic Handmade Hybrid Comoro attitude teal thrifty TLS Electric	payment	2023-04-05 18:06:49.607+02	2023-04-05 18:06:49.607+02
18a49918-bec1-43ca-944c-aca52ad3f135	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	amidst lumen Advanced Wooden Metrics soar Frami Cuyahoga right port	news	2023-04-05 18:06:49.607+02	2023-04-05 18:06:49.607+02
7eef8d35-b719-469f-a838-efb3d6817dc7	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	East Comoros Electric whenever Account HEX virtual huzzah Markets microchip	products	2023-04-05 18:06:49.608+02	2023-04-05 18:06:49.608+02
e12adc5b-7236-450e-a241-70840e3af988	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	Games elegantly Avon Gorgeous Internal so purple Texas adipisci quas	news	2023-04-05 18:06:49.608+02	2023-04-05 18:06:49.608+02
26c6db4c-ed24-407e-81f7-b247b39862a4	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	BMX Gold Northeast Consultant Forward Tuna coherent Corners Supervisor Connecticut	products	2023-04-05 18:06:49.608+02	2023-04-05 18:06:49.608+02
4947b05a-cf99-4527-b0fd-695c71eb61bb	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	once Ergonomic Bedfordshire eek digital ugh Electric Pennsylvania Product Northwest	products	2023-04-05 18:06:49.608+02	2023-04-05 18:06:49.608+02
0307475c-9103-40d6-9c75-6583581c1a6e	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	Utah Gasoline Trial North experienced customized West Metal Samoa yet	payment	2023-04-05 18:06:49.608+02	2023-04-05 18:06:49.608+02
513575cb-d5d0-4727-a01b-9a654708fc87	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	Honda Steel Maryland Americium Account Reggae program Rap olive Sharable	news	2023-04-05 18:06:49.608+02	2023-04-05 18:06:49.608+02
4305394e-2437-495e-9c0f-dc05edf4a5ef	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	functionalities purple ampere Loan South synergy Generic invoice coherent like	products	2023-04-05 18:06:49.608+02	2023-04-05 18:06:49.608+02
9d0f7bdd-8826-493b-a89a-cbb0d622a49e	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	interface Tala Passenger North legacy Awesome coat across Web Non	payment	2023-04-05 18:06:49.609+02	2023-04-05 18:06:49.609+02
373e46fb-8205-4322-b1e5-ef0ad2570490	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	ostrich transmitting strategic Kia Global up regarding ivory Dollar tan	payment	2023-04-05 18:06:49.609+02	2023-04-05 18:06:49.609+02
bdeade3c-5681-4f06-8b82-95d53eaf5440	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	Volvo before schedule innovate Frozen that Small strategy And auxiliary	updates	2023-04-05 18:06:49.609+02	2023-04-05 18:06:49.609+02
ef105023-8a3e-4905-8e15-03881b18a07a	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	plum past Southwest Kendale Folding superstructure male Technician Switchable Administrator	updates	2023-04-05 18:06:49.609+02	2023-04-05 18:06:49.609+02
786d2095-5f03-4c04-90d3-22ec5ee1ffe6	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	Modern questioningly pixel Brazil New generate Waco East TLS analyzer	news	2023-04-05 18:06:49.609+02	2023-04-05 18:06:49.609+02
509ab42a-7500-462e-8df1-75abf74d37df	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	f	collaboration Rustic Cotton mint South convergence although Recumbent Folding Well	payment	2023-04-05 18:06:49.609+02	2023-04-05 18:06:49.609+02
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" ("deliveryCountry", "deliveryCity", "deliveryStreet", "buyerId", id, "paymentMethod", "isPaid", status, "totalAmount", "createdAt", "updatedAt") FROM stdin;
Israel	Dearborn	11016 Ratke Branch	6d233886-bae9-4ae6-abeb-9d3eae438085	25b77fd2-acd2-4cf3-8f37-c024a051757a	instapayment	t	Processing	13710.64	2023-04-05 20:05:12.913+02	2023-04-05 20:05:12.913+02
Switzerland	New Cory	476 Eliza Fort	6d233886-bae9-4ae6-abeb-9d3eae438085	91fc0d42-0e79-4695-966c-8367d8a03184	diners_club	t	Delivered	50052.09	2023-04-05 20:05:12.913+02	2023-04-05 20:05:12.913+02
Israel	Port Thad	228 Hammes Knolls	6d233886-bae9-4ae6-abeb-9d3eae438085	55caee30-1b12-4ee7-bf5c-0cc052e3189e	mastercard	f	Pending	10039.43	2023-04-05 20:05:12.913+02	2023-04-05 20:05:12.913+02
Slovenia	Tiffanyberg	880 Bernhard Knoll	6d233886-bae9-4ae6-abeb-9d3eae438085	3a3f1adb-6b14-4ffe-9ab3-a8908a8f8258	visa	t	Processing	50967.14	2023-04-05 20:05:12.913+02	2023-04-05 20:05:12.913+02
Peru	Collierville	043 Bill Overpass	6d233886-bae9-4ae6-abeb-9d3eae438085	bead8bd1-8867-4cba-9eb8-11f0ac8199f0	switch	t	Processing	19138.06	2023-04-05 20:05:12.914+02	2023-04-05 20:05:12.914+02
Bouvet Island (Bouvetoya)	Elgin	71305 Lubowitz Camp	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	4653b037-0c13-4bd7-9771-8a713011d1e9	maestro	t	Processing	97281.84	2023-04-05 18:06:49.579+02	2023-04-05 18:06:49.579+02
Comoros	Salmafurt	02162 Murray Terrace	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	26043d3d-34b9-41e5-8e86-e72e4a3cad23	discover	t	Processing	79668.62	2023-04-05 18:06:49.579+02	2023-04-05 18:06:49.579+02
Romania	Lehnerland	553 Jamar Neck	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	3e9eeddc-3557-48d8-9ac8-300b3bce9ac4	solo	t	Delivered	49055.46	2023-04-05 18:06:49.579+02	2023-04-05 18:06:49.579+02
Tuvalu	Amarifield	86434 Langosh Estates	fa882d95-dcc8-41d0-b667-db4a1c7d87a8	3af8a5d7-2719-4cce-82cb-72c745ab8bce	visa	f	Pending	15384.41	2023-04-05 18:06:49.58+02	2023-04-05 18:06:49.58+02
\.


--
-- Data for Name: orderitem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orderitem (quantity, "productId", "orderId", price, id) FROM stdin;
23557	226a9cc9-9ce1-4c20-8fbc-9f8f5c6cb8f5	91fc0d42-0e79-4695-966c-8367d8a03184	60693.8	676e28dc-9c71-4f0a-be4e-fd5adb6bf756
90979	565ac9c6-1313-4cbe-942b-48bc0dff8331	55caee30-1b12-4ee7-bf5c-0cc052e3189e	6729.45	78491b14-b58b-48c8-9406-ac0db9daf02a
176	31f45d35-5f8a-4c91-84ca-f2be5a26be60	91fc0d42-0e79-4695-966c-8367d8a03184	7151.29	ad638157-e80e-4d30-92a9-e3d5cdfde171
73120	685c8938-ac44-43c8-92e7-6cc8c508dea2	bead8bd1-8867-4cba-9eb8-11f0ac8199f0	75904.37	bd024b34-8f68-46df-9c4f-2cd3e8f9e0a3
63987	351702a8-5998-457d-ac5c-9a1d79fc6ea8	25b77fd2-acd2-4cf3-8f37-c024a051757a	55872.91	6dcefbe0-24e9-4b89-b5ee-3344fa19e90c
35089	351702a8-5998-457d-ac5c-9a1d79fc6ea8	25b77fd2-acd2-4cf3-8f37-c024a051757a	95142.26	77382d6c-9bf8-48e9-b6c2-61b3b7f73766
10372	351702a8-5998-457d-ac5c-9a1d79fc6ea8	91fc0d42-0e79-4695-966c-8367d8a03184	3138.96	62160832-f2b3-41a0-b190-4aa7a8dd1354
16465	351702a8-5998-457d-ac5c-9a1d79fc6ea8	bead8bd1-8867-4cba-9eb8-11f0ac8199f0	68095.41	378e7b4d-f55d-4b93-b0f6-1892ba8c238e
89161	31f45d35-5f8a-4c91-84ca-f2be5a26be60	91fc0d42-0e79-4695-966c-8367d8a03184	76268.19	ebbc435d-180d-4fd7-8646-085087c81169
35801	226a9cc9-9ce1-4c20-8fbc-9f8f5c6cb8f5	bead8bd1-8867-4cba-9eb8-11f0ac8199f0	14436.2	6ec19868-f437-4df2-b95d-f367a847f637
26693	223c2bcf-2e50-49c3-ae20-b11c0cedcaa4	3e9eeddc-3557-48d8-9ac8-300b3bce9ac4	16204.15	6995db74-bfd8-4cf4-b596-bc002a2c5327
25960	abe5e9c7-edee-4540-aa78-9ffd8826ce46	3af8a5d7-2719-4cce-82cb-72c745ab8bce	93876.52	c9c464a1-3d7d-4b49-b25b-55ebba991450
86355	c6aba4ad-dc3f-4578-a48f-4c7dc0224751	369c1c49-ee99-4718-a3ee-ea101b71c3da	61266.23	53227a4c-c38c-47b7-bf34-b8209f041ec9
369	c9e184c1-26a9-4ce5-be0f-3ad78946d509	3af8a5d7-2719-4cce-82cb-72c745ab8bce	14020.89	7f35732b-e095-480a-acb9-0159e14b7576
77865	c9e184c1-26a9-4ce5-be0f-3ad78946d509	3e9eeddc-3557-48d8-9ac8-300b3bce9ac4	8988.58	ffb51038-0b1f-4dfb-ae34-bd9111c4eb33
16545	abe5e9c7-edee-4540-aa78-9ffd8826ce46	369c1c49-ee99-4718-a3ee-ea101b71c3da	41080.55	c141edb7-f5df-4577-9235-a858cb9c7150
72758	7b529556-436e-41b5-8386-3094e71a3928	3e9eeddc-3557-48d8-9ac8-300b3bce9ac4	95778.48	f104c454-c78d-4df3-a4ff-3bdd79984c67
23819	c6aba4ad-dc3f-4578-a48f-4c7dc0224751	3af8a5d7-2719-4cce-82cb-72c745ab8bce	12562.78	f3595738-d777-46a1-a039-e8375dc15b62
11078	abe5e9c7-edee-4540-aa78-9ffd8826ce46	369c1c49-ee99-4718-a3ee-ea101b71c3da	72029.83	cbf659f2-9e60-4ba7-86a0-be46eddc9c3c
67060	7b529556-436e-41b5-8386-3094e71a3928	3af8a5d7-2719-4cce-82cb-72c745ab8bce	77428.79	10f874e4-a649-4857-862d-4e4e9b075d72
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, amount, "orderId", method, discount, "stripeId", "createdAt", "updatedAt") FROM stdin;
1987f328-41bb-4799-981c-f27bd5d8b1f6	13710.64	25b77fd2-acd2-4cf3-8f37-c024a051757a	instapayment	0	cs_test_b1nnYG4jFlA1axzKRhj1LJrlcLig2yiFGnTxTWaX7SYCPeitfqRSoECsKA	2023-04-05 18:40:01.955+02	2023-04-05 18:40:01.955+02
8d9066a5-9530-4872-9ce7-7ffda513063e	50052.09	91fc0d42-0e79-4695-966c-8367d8a03184	diners_club	0	cs_test_b1d1JN9wTy6gTs5ozmEoi2MGUb4GxFuImYh0GFnU5wywfuewsmCIEcWNHp	2023-04-02 22:27:30.497+02	2023-04-02 22:27:30.497+02
fd693193-7d9e-421d-8ac6-9ca45b75ac0a	50967.14	3a3f1adb-6b14-4ffe-9ab3-a8908a8f8258	visa	0	cs_test_b1uWxbyNLZui6eZZrGzAWbJbVgNIKqmPSat2k3ShviYJU0tiR9ubqm0OKb	2023-04-04 04:11:04.237+02	2023-04-04 04:11:04.237+02
bc4ee2e6-1072-4ad3-a506-07dfa2e31c40	19138.06	bead8bd1-8867-4cba-9eb8-11f0ac8199f0	switch	0	cs_test_b1eTjuln2msGcGhx5fzA7eBVOpR6WJkx5Nkpd8VxGAK4RwKxwyqfBox5WM	2023-04-03 18:07:40.46+02	2023-04-03 18:07:40.46+02
b61e830f-c551-496f-b60c-e2f857eb9717	97281.84	4653b037-0c13-4bd7-9771-8a713011d1e9	maestro	0	cs_test_b1nnYG4jFlA1axzKRhj1LJrlcLig2yiFGnTxTWaX7SYCPeitfqRSoECsKA	2023-04-02 01:22:09.3+02	2023-04-02 01:22:09.3+02
99a53405-d40a-4068-8c92-1ac6143b420d	79668.62	26043d3d-34b9-41e5-8e86-e72e4a3cad23	discover	0	cs_test_b1d1JN9wTy6gTs5ozmEoi2MGUb4GxFuImYh0GFnU5wywfuewsmCIEcWNHp	2023-04-03 22:56:01.991+02	2023-04-03 22:56:01.991+02
951480fb-00a4-4817-828c-987811a34afd	49055.46	3e9eeddc-3557-48d8-9ac8-300b3bce9ac4	solo	0	cs_test_b1uWxbyNLZui6eZZrGzAWbJbVgNIKqmPSat2k3ShviYJU0tiR9ubqm0OKb	2023-04-04 14:41:11.804+02	2023-04-04 14:41:11.804+02
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, images, name, description, quantity, "sellerId", exp_date, available, price, category, "createdAt", "updatedAt") FROM stdin;
685c8938-ac44-43c8-92e7-6cc8c508dea2	{https://loremflickr.com/640/480,https://loremflickr.com/640/480,https://loremflickr.com/640/480}	Elegant Concrete Chicken	The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients	48193	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	2023-07-05 09:48:12.201+02	t	772	2	2023-04-05 20:05:12.886+02	2023-04-05 20:05:12.886+02
565ac9c6-1313-4cbe-942b-48bc0dff8331	{https://loremflickr.com/640/480,https://loremflickr.com/640/480,https://loremflickr.com/640/480}	Ergonomic Steel Mouse	The Football Is Good For Training And Recreational Purposes	47226	6d233886-bae9-4ae6-abeb-9d3eae438085	2024-04-13 00:52:14.603+02	t	630	2	2023-04-05 20:05:12.886+02	2023-04-05 20:05:12.886+02
226a9cc9-9ce1-4c20-8fbc-9f8f5c6cb8f5	{https://loremflickr.com/640/480,https://loremflickr.com/640/480,https://loremflickr.com/640/480}	Elegant Soft Bacon	New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart	64700	6d233886-bae9-4ae6-abeb-9d3eae438085	2023-09-18 15:07:54.308+02	t	552	3	2023-04-05 20:05:12.886+02	2023-04-05 20:05:12.886+02
351702a8-5998-457d-ac5c-9a1d79fc6ea8	{https://loremflickr.com/640/480,https://loremflickr.com/640/480,https://loremflickr.com/640/480}	Oriental Wooden Chair	The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality	56596	68d3b3cc-eee2-43f0-a416-17f644fb1445	2024-09-23 19:08:36.971+02	t	989	2	2023-04-05 20:05:12.886+02	2023-04-05 20:05:12.886+02
31f45d35-5f8a-4c91-84ca-f2be5a26be60	{https://loremflickr.com/640/480,https://loremflickr.com/640/480,https://loremflickr.com/640/480}	Refined Concrete Tuna	The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients	92474	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	2025-03-06 17:50:01.122+02	t	675	1	2023-04-05 20:05:12.886+02	2023-04-05 20:05:12.886+02
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, "productId", "userId", feedback, rating, "createdAt", "updatedAt") FROM stdin;
24c6f372-95e6-432b-a112-a7e1a4c36fb0	31f45d35-5f8a-4c91-84ca-f2be5a26be60	6d233886-bae9-4ae6-abeb-9d3eae438085	Ipsa veniam eum ex. Aut cum quod architecto libero qui ullam ullam nobis. Dignissimos quaerat et quibusdam harum atque inventore.	2	2023-04-05 20:05:12.9+02	2023-04-05 20:05:12.9+02
cf6f9c06-e29e-4826-8eb0-60ed6780c0e7	565ac9c6-1313-4cbe-942b-48bc0dff8331	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	Beatae odit amet praesentium tempore sit. Laboriosam aliquam culpa est sunt. Fuga sit nihil eligendi modi enim suscipit accusantium. Minima modi soluta iure. Voluptatem iure illum modi in architecto aut architecto. Magni reprehenderit culpa blanditiis vel delectus.	5	2023-04-05 20:05:12.9+02	2023-04-05 20:05:12.9+02
60847887-2a74-4447-a671-40e3a8d44509	226a9cc9-9ce1-4c20-8fbc-9f8f5c6cb8f5	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	Dolor vero dolore eos id nostrum dignissimos accusamus. Similique veniam officia enim cum. Consectetur nobis alias. Illum labore minima quas deleniti modi sequi illum. Fugiat repellendus assumenda distinctio eligendi iure iste quam natus culpa.	2	2023-04-05 20:05:12.9+02	2023-04-05 20:05:12.9+02
5f4fbeec-cace-4f04-b584-68eceaa3c90e	685c8938-ac44-43c8-92e7-6cc8c508dea2	68d3b3cc-eee2-43f0-a416-17f644fb1445	Nesciunt ullam at maxime totam expedita suscipit quibusdam neque reiciendis. Minus nihil eius inventore in non tempora numquam error tenetur. Cum cumque saepe ab. Explicabo laborum quis. Corporis assumenda ullam. Nihil dolor rerum nisi voluptates voluptas iure dignissimos.	5	2023-04-05 20:05:12.901+02	2023-04-05 20:05:12.901+02
28de1e6c-f672-4386-972e-d058978a99e2	226a9cc9-9ce1-4c20-8fbc-9f8f5c6cb8f5	6d233886-bae9-4ae6-abeb-9d3eae438085	Sint culpa maxime voluptas. Asperiores voluptas nam voluptas ut quisquam sapiente doloribus dignissimos voluptatem. Soluta explicabo beatae laudantium ut non quod itaque soluta. Totam fugit quibusdam maxime facilis deleniti eaque placeat temporibus quas. Nulla impedit commodi tempora eveniet explicabo reiciendis esse vel at. Molestias ad quibusdam aspernatur consectetur.	1	2023-04-05 20:05:12.901+02	2023-04-05 20:05:12.901+02
7807c3b6-0958-437f-b88d-7372e0f21f73	31f45d35-5f8a-4c91-84ca-f2be5a26be60	2abaa705-cc0c-444c-9bb8-2785abad8753	Quidem ipsa earum. Porro expedita neque itaque laboriosam consequatur recusandae eos sapiente deserunt.	2	2023-04-05 20:05:12.901+02	2023-04-05 20:05:12.901+02
8e1e2e3f-7a44-4b75-ab3c-22ed4a049e24	565ac9c6-1313-4cbe-942b-48bc0dff8331	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	Perspiciatis excepturi ratione vero accusantium temporibus autem natus distinctio quibusdam. Corporis maxime occaecati optio id magni dolor sed similique.	4	2023-04-05 20:05:12.901+02	2023-04-05 20:05:12.901+02
042b7203-392f-4800-875e-4aa0391664c9	31f45d35-5f8a-4c91-84ca-f2be5a26be60	68d3b3cc-eee2-43f0-a416-17f644fb1445	Occaecati nostrum error expedita mollitia provident quibusdam animi quam. Voluptas nobis neque adipisci laborum. Velit cum quos voluptas perspiciatis in quas ea voluptatem. Repellat commodi sequi quasi vel corporis modi culpa dolorem libero.	4	2023-04-05 20:05:12.901+02	2023-04-05 20:05:12.901+02
73b85caa-f2eb-4130-ab49-d36f5643a99a	226a9cc9-9ce1-4c20-8fbc-9f8f5c6cb8f5	6d233886-bae9-4ae6-abeb-9d3eae438085	Saepe veniam est laborum vitae numquam exercitationem illum quas. Sed ipsam accusantium. At omnis voluptas reprehenderit et dolor maiores dolor. Aperiam iste voluptatum doloremque. Earum exercitationem quas.	3	2023-04-05 20:05:12.901+02	2023-04-05 20:05:12.901+02
6f8aaf68-2376-4ba2-bacf-30ac9ff01936	226a9cc9-9ce1-4c20-8fbc-9f8f5c6cb8f5	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	Esse quae accusantium id at cupiditate in in consectetur. Fugiat itaque commodi deleniti excepturi hic.	5	2023-04-05 20:05:12.901+02	2023-04-05 20:05:12.901+02
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, avatar, cover_image, username, email, password, role, gender, verified, email_token, "isEmailVerified", "createdAt", "updatedAt", "mustUpdatePassword", "lastTimePasswordUpdated", "resetPasswordToken", "resetPasswordExpires", mfa_enabled, "disabledUser", mfa_code, mfa_timeout) FROM stdin;
2abaa705-cc0c-444c-9bb8-2785abad8753	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/46.jpg	https://loremflickr.com/640/480	John Doe	john@gmail.com	$2b$10$9M/gykFVjQDMcSJkxHmlHe6TaWbWypzM6fuCKvkFs4jQkzqWdujNa	seller	male	t	\N	f	2022-05-24 06:45:07.357+02	2023-04-05 20:05:12.628+02	f	2023-04-05 20:05:06.321+02	\N	\N	f	f	\N	\N
68d3b3cc-eee2-43f0-a416-17f644fb1445	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/195.jpg	https://loremflickr.com/640/480	Jean Doe	jean@gmail.com	$2b$10$3HowuWwXzLIpxK0TO1T8ZOve.iKOPDD94Wj4o4j.MHL/Mg9T5GCxu	seller	female	t	\N	f	2022-04-10 12:49:52.007+02	2023-04-05 20:05:12.695+02	f	2023-04-05 20:05:06.321+02	\N	\N	f	f	\N	\N
6d233886-bae9-4ae6-abeb-9d3eae438085	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/855.jpg	https://loremflickr.com/640/480	Mary Doe	mary@gmail.com	$2b$10$2qWBoINYX/dk/R3ZJHgXGuY1wg3/FvwG3koWDqdd2.bmY/5ovjqVG	buyer	female	t	\N	f	2022-07-13 15:48:40.118+02	2023-04-05 20:05:12.762+02	f	2023-04-05 20:05:06.321+02	\N	\N	f	f	\N	\N
226b8d9f-42a3-4b5d-a1cd-c8c85a785445	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/556.jpg	https://loremflickr.com/640/480	brogrammer	brogrammer@gmail.com	$2b$10$IweFZMmZm19Y/SABjXpF/OBYDfvuS0ojB7ydZi.mWiEbG67T7qOT2	admin	none	t	\N	f	2022-11-03 02:33:20.713+02	2023-04-05 20:53:28.583+02	f	2023-04-05 20:53:28.583+02	\N	\N	f	f	\N	\N
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlists (id, "userId", "productId", "createdAt", "updatedAt") FROM stdin;
4521368f-092a-46e6-bf99-852a9ff3ec59	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	351702a8-5998-457d-ac5c-9a1d79fc6ea8	2023-04-05 20:05:12.973+02	2023-04-05 20:05:12.973+02
566e82bd-e90c-4098-b319-8565fbdc91ae	2abaa705-cc0c-444c-9bb8-2785abad8753	351702a8-5998-457d-ac5c-9a1d79fc6ea8	2023-04-05 20:05:12.973+02	2023-04-05 20:05:12.973+02
f669f0a9-93a8-4398-8f10-f6d056d00652	2abaa705-cc0c-444c-9bb8-2785abad8753	226a9cc9-9ce1-4c20-8fbc-9f8f5c6cb8f5	2023-04-05 20:05:12.973+02	2023-04-05 20:05:12.973+02
7471b6fe-281b-460c-86ec-96ed2816e3c6	6d233886-bae9-4ae6-abeb-9d3eae438085	351702a8-5998-457d-ac5c-9a1d79fc6ea8	2023-04-05 20:05:12.973+02	2023-04-05 20:05:12.973+02
7760a3f2-10f0-487e-b59a-3274449c3e61	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	685c8938-ac44-43c8-92e7-6cc8c508dea2	2023-04-05 20:05:12.974+02	2023-04-05 20:05:12.974+02
bc4017c7-97ca-4150-9bba-5fe0b9d40964	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	351702a8-5998-457d-ac5c-9a1d79fc6ea8	2023-04-05 20:05:12.974+02	2023-04-05 20:05:12.974+02
2cfd32e7-b570-4f4c-8a7d-e1302f999873	68d3b3cc-eee2-43f0-a416-17f644fb1445	565ac9c6-1313-4cbe-942b-48bc0dff8331	2023-04-05 20:05:12.974+02	2023-04-05 20:05:12.974+02
30929dc9-b049-478e-abb6-f8755b2853ef	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	685c8938-ac44-43c8-92e7-6cc8c508dea2	2023-04-05 20:05:12.974+02	2023-04-05 20:05:12.974+02
0cf0ac7c-edaf-4921-9980-a76ada55f15e	6d233886-bae9-4ae6-abeb-9d3eae438085	351702a8-5998-457d-ac5c-9a1d79fc6ea8	2023-04-05 20:05:12.974+02	2023-04-05 20:05:12.974+02
1e514fcf-77fa-46cd-b0da-e957f83e329d	226b8d9f-42a3-4b5d-a1cd-c8c85a785445	565ac9c6-1313-4cbe-942b-48bc0dff8331	2023-04-05 20:05:12.974+02	2023-04-05 20:05:12.974+02
\.


--
-- Name: Blockedtokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Blockedtokens_id_seq"', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 3, true);


--
-- Name: Blockedtokens Blockedtokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Blockedtokens"
    ADD CONSTRAINT "Blockedtokens_pkey" PRIMARY KEY (id);


--
-- Name: Chat Chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- Name: orderitem orderitem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitem
    ADD CONSTRAINT orderitem_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: Chat Chat_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: carts carts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: payments payments_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."order"(id) ON DELETE CASCADE;


--
-- Name: products products_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_fkey FOREIGN KEY (category) REFERENCES public.categories(id);


--
-- Name: products products_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: wishlists wishlists_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT "wishlists_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: wishlists wishlists_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT "wishlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

