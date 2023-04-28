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
-- Name: Log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Log" (
    id uuid NOT NULL,
    level character varying(255),
    message character varying(255),
    "userId" uuid NOT NULL,
    metadata json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Log" OWNER TO postgres;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: Subscribers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subscribers" (
    id uuid NOT NULL,
    email character varying(255),
    "firstName" character varying(255),
    "lastName" character varying(255),
    subscribed boolean DEFAULT false,
    preferences json DEFAULT '{}'::json NOT NULL,
    "verificationToken" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Subscribers" OWNER TO postgres;

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
    "statusUpdated" boolean DEFAULT false,
    "expectedDeliveryDate" timestamp with time zone,
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
    "statusUpdated" boolean DEFAULT false,
    "expectedDeliveryDate" timestamp with time zone,
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
    "lastTimePasswordUpdated" timestamp with time zone DEFAULT '2023-04-30 18:43:24.614+02'::timestamp with time zone,
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
1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplYW5AZ21haWwuY29tIiwiaWQiOiI4Y2I4ZWI0YS0xYzRlLTQ3OTUtODFmZi1lNDYyYzBiZDE2NjEiLCJtdXN0VXBkYXRlUGFzc3dvcmQiOmZhbHNlLCJpYXQiOjE2ODI4ODMyNTd9.Zt6JQGDM9abSFokkGIFpbIa3JA4gFB2UhFEMPeDdopg	2023-04-30 21:34:23.031+02	2023-04-30 21:34:23.031+02
2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplYW5AZ21haWwuY29tIiwiaWQiOiI4Y2I4ZWI0YS0xYzRlLTQ3OTUtODFmZi1lNDYyYzBiZDE2NjEiLCJtdXN0VXBkYXRlUGFzc3dvcmQiOmZhbHNlLCJpYXQiOjE2ODI4ODMyNzN9.SY9NqZM7C7uN92YSTOwPVT61s2ckIUXwqsVqXmvR0oQ	2023-04-30 21:34:33.725+02	2023-04-30 21:34:33.725+02
\.


--
-- Data for Name: Chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Chat" (id, room, message, "userId", "createdAt", "updatedAt") FROM stdin;
0f65378a-c3ca-40fc-8964-94af828c5f6a	brogrammers	Sunt aliquam fuga natus assumenda laudantium provident incidunt quis. Modi dolorum quas necessitatibus ex beatae iusto dolores. Ut nulla minus rem distinctio hic officia vero eligendi inventore. Inventore rem odit quas culpa perspiciatis.	5ff06976-e8c1-4d5f-b2e2-7cec35138e8a	2023-03-24 11:57:30.491+02	2023-03-24 11:57:30.491+02
5be7ce2b-1c31-4dbe-813f-6f3b0894a043	brogrammers	Alias eligendi voluptatem doloribus repudiandae deserunt tempora consequuntur. Deserunt fugit doloribus adipisci dolor dicta vel quo. Sapiente a aut explicabo odio rem consectetur tempora. Nulla error beatae doloribus excepturi.	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	2023-02-06 11:25:46.721+02	2023-02-06 11:25:46.721+02
c92f0570-bf44-4cdc-89e2-db181e2a3f8d	brogrammers	Ullam maxime odio aperiam quas. Iure magni eius laboriosam nisi eius harum illum doloremque. Exercitationem illum officia dolores velit quis repudiandae. Culpa hic occaecati veniam quidem saepe quaerat. Rem hic eius numquam a fugit doloribus nulla.	06dc1d7b-a427-43e4-8b82-22dcb6546001	2022-09-05 00:57:14.785+02	2022-09-05 00:57:14.785+02
1375b142-89d0-4dce-a7f1-b66df554a542	brogrammers	Non quae voluptatum ipsa quis esse. Odit quasi incidunt dicta dolor suscipit animi. Earum similique eaque necessitatibus libero nesciunt illum repellendus saepe. Distinctio optio inventore eligendi dolores velit.	5ff06976-e8c1-4d5f-b2e2-7cec35138e8a	2022-09-07 10:27:37.743+02	2022-09-07 10:27:37.743+02
d521d32f-3faa-4735-bfa2-8069338a65e3	brogrammers	Molestiae doloremque quibusdam eligendi inventore deserunt veniam. Voluptatibus dicta veniam animi itaque dolore. Excepturi sint ex incidunt molestiae tenetur nemo consequuntur nisi.	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	2023-02-09 10:05:32.404+02	2023-02-09 10:05:32.404+02
4f41b3f6-5c29-4d6f-8a90-6eb524aff883	brogrammers	At molestias odit consequuntur recusandae doloremque sunt repudiandae exercitationem debitis. In at voluptas esse. Praesentium minima necessitatibus natus repellat ab dicta. Similique distinctio modi quod voluptates eos voluptas id harum. Labore nesciunt facere sint quas sequi saepe. Deserunt nam fugiat ratione ipsum facilis adipisci.	5ff06976-e8c1-4d5f-b2e2-7cec35138e8a	2022-10-12 17:43:24.78+02	2022-10-12 17:43:24.78+02
a3b8f09b-c70f-4fe3-9a5a-bd390109dd96	brogrammers	Vel magni quibusdam laudantium quam possimus. Voluptas culpa cumque velit voluptatum ea eum excepturi pariatur necessitatibus.	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	2022-12-21 07:39:10.387+02	2022-12-21 07:39:10.387+02
973aeea7-9e59-4166-a304-347c6f87046b	brogrammers	Cum molestiae enim fugiat explicabo quos iste cum voluptas ut. Repudiandae nisi repellat.	9659b5be-2e67-4a39-ad4b-f525b91284ec	2022-06-17 06:19:07.77+02	2022-06-17 06:19:07.77+02
2d21bc21-e0c7-427f-b038-e4b8f96b2f6a	brogrammers	Dolorum suscipit quisquam. Placeat porro consequuntur eveniet expedita. Deserunt aut modi vero doloremque numquam. Sunt at autem id consectetur nulla. Beatae reprehenderit beatae doloremque harum soluta deleniti. Quis aspernatur aliquam expedita alias.	9659b5be-2e67-4a39-ad4b-f525b91284ec	2022-08-11 10:03:30.401+02	2022-08-11 10:03:30.401+02
cf34bf32-6469-44aa-9c51-a4d6fe3ffa4f	brogrammers	Enim doloribus neque facere numquam unde reiciendis consectetur dolorum consequatur. Quod culpa harum reiciendis rerum modi ipsum distinctio. Voluptatem nobis incidunt animi iure enim consectetur repellendus. Mollitia numquam sit voluptatum illo deleniti vel libero. Consequuntur quidem mollitia saepe. Sapiente nostrum omnis ut inventore magnam eveniet minus id.	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	2023-01-25 05:25:41.835+02	2023-01-25 05:25:41.835+02
\.


--
-- Data for Name: Log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Log" (id, level, message, "userId", metadata, "createdAt", "updatedAt") FROM stdin;
46e7fce2-1899-4305-b3a0-d75a1fdb7af3	info	User irabd44@gmail.com logged in	3cfc76c8-191e-4cb1-a82f-e721e7314093	{"loginRequest":"irabd44@gmail.com"}	2023-04-30 18:51:50.935+02	2023-04-30 18:51:50.935+02
e1ff2d53-967f-4044-9850-e1203a6b0a07	info	User irabd44@gmail.com viewed his  profile	3cfc76c8-191e-4cb1-a82f-e721e7314093	{"profile":{"id":"3cfc76c8-191e-4cb1-a82f-e721e7314093","avatar":"https://t3.ftcdn.net/jpg/01/28/56/34/360_F_128563455_bGrVZnfDCL0PxH1sU33NpOhGcCc1M7qo.jpg","cover_image":"https://cdn.conceptartempire.com/images/360/01-concept-art-video-game-item-shop.jpg","username":"blackd44","email":"irabd44@gmail.com","password":"$2b$10$4QdTQ.YtQoR5n3yKEniY1.k0PFiNdAoJPjGxn7SVtzNMUKJxQ3Foe","role":"buyer","verified":true,"email_token":null,"gender":"Male","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":"2023-04-30T16:51:16.171Z","mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:44:17.176Z","createdAt":"2023-04-30T16:51:16.176Z","updatedAt":"2023-04-30T16:51:29.837Z"}}	2023-04-30 18:51:51.97+02	2023-04-30 18:51:51.97+02
883a0bc7-6124-4416-b866-4e51402ec120	info	User brogrammer@gmail.com logged in	06dc1d7b-a427-43e4-8b82-22dcb6546001	{"loginRequest":"brogrammer@gmail.com"}	2023-04-30 18:52:15.74+02	2023-04-30 18:52:15.74+02
53fcffa7-d19a-45d4-8ce9-bb35a4436897	info	User irabd44@gmail.com viewed his  profile	3cfc76c8-191e-4cb1-a82f-e721e7314093	{"profile":{"id":"3cfc76c8-191e-4cb1-a82f-e721e7314093","avatar":"https://t3.ftcdn.net/jpg/01/28/56/34/360_F_128563455_bGrVZnfDCL0PxH1sU33NpOhGcCc1M7qo.jpg","cover_image":"https://cdn.conceptartempire.com/images/360/01-concept-art-video-game-item-shop.jpg","username":"blackd44","email":"irabd44@gmail.com","password":"$2b$10$4QdTQ.YtQoR5n3yKEniY1.k0PFiNdAoJPjGxn7SVtzNMUKJxQ3Foe","role":"buyer","verified":true,"email_token":null,"gender":"Male","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":"2023-04-30T16:51:16.171Z","mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:44:17.176Z","createdAt":"2023-04-30T16:51:16.176Z","updatedAt":"2023-04-30T16:51:29.837Z"}}	2023-04-30 18:52:27.791+02	2023-04-30 18:52:27.791+02
bdae596f-1e82-4fdb-870b-65c256e44c30	info	User brogrammer@gmail.com set a new role seller to irabd44@gmail.com	06dc1d7b-a427-43e4-8b82-22dcb6546001	{"Request":"seller"}	2023-04-30 18:52:57.351+02	2023-04-30 18:52:57.351+02
78400f5b-9b28-49fb-87b4-3ba2e54600ad	info	User irabd44@gmail.com viewed his  profile	3cfc76c8-191e-4cb1-a82f-e721e7314093	{"profile":{"id":"3cfc76c8-191e-4cb1-a82f-e721e7314093","avatar":"https://t3.ftcdn.net/jpg/01/28/56/34/360_F_128563455_bGrVZnfDCL0PxH1sU33NpOhGcCc1M7qo.jpg","cover_image":"https://cdn.conceptartempire.com/images/360/01-concept-art-video-game-item-shop.jpg","username":"blackd44","email":"irabd44@gmail.com","password":"$2b$10$4QdTQ.YtQoR5n3yKEniY1.k0PFiNdAoJPjGxn7SVtzNMUKJxQ3Foe","role":"seller","verified":true,"email_token":null,"gender":"Male","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":"2023-04-30T16:51:16.171Z","mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:44:17.176Z","createdAt":"2023-04-30T16:51:16.176Z","updatedAt":"2023-04-30T16:52:57.323Z"}}	2023-04-30 18:53:33.573+02	2023-04-30 18:53:33.573+02
121c70ea-41d4-4193-be33-054aa77c326e	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 18:55:19.17+02	2023-04-30 18:55:19.17+02
83747382-0f3b-4628-a2bf-50f4364cdf7b	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 18:55:19.236+02	2023-04-30 18:55:19.236+02
75c50fdb-7f02-4de9-94ac-36765c9dd0cb	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 18:55:29.826+02	2023-04-30 18:55:29.826+02
5cb547ab-135e-4416-bf58-85badf752094	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 18:55:29.864+02	2023-04-30 18:55:29.864+02
7d895d45-d417-47a8-b33f-e6f22dd10355	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 18:56:04.357+02	2023-04-30 18:56:04.357+02
0c114994-6d70-42e2-b500-597f3c4cb627	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 18:56:04.39+02	2023-04-30 18:56:04.39+02
9b48af83-4c55-4d5b-b2b2-37e7d363f446	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 18:56:14.992+02	2023-04-30 18:56:14.992+02
a76f24a3-1cc3-4d4a-b5cb-01bb5cf3759b	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 18:56:15.073+02	2023-04-30 18:56:15.073+02
b5f7c81e-b595-444d-b700-ea2a5d728a51	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 18:57:24.624+02	2023-04-30 18:57:24.624+02
dbc7ca05-184f-4ecd-adae-fae4e278b832	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 18:57:24.688+02	2023-04-30 18:57:24.688+02
03108c38-9cc3-4003-86c5-e69500f3aa56	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 18:57:34.988+02	2023-04-30 18:57:34.988+02
06e04abf-fca8-4a1f-8220-cd02d7de4ab8	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 21:16:35.398+02	2023-04-30 21:16:35.398+02
539f9c4c-511c-441d-9b84-119d9cfe2717	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 21:25:58.924+02	2023-04-30 21:25:58.924+02
45b74745-d604-4e05-9b49-215dbfc30f07	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 18:57:35.027+02	2023-04-30 18:57:35.027+02
02614539-15e2-4d52-89dd-fdddbb41d2a9	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 18:58:12.582+02	2023-04-30 18:58:12.582+02
24efe790-f28e-4aa7-a203-4d01b3edd993	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 18:58:12.635+02	2023-04-30 18:58:12.635+02
385d9772-5c93-47b5-8445-c9669c5a34e0	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 18:58:23.047+02	2023-04-30 18:58:23.047+02
35f9723c-7f8d-486e-b4f5-529ed21ac3a5	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 18:58:23.073+02	2023-04-30 18:58:23.073+02
1df91b18-6af1-4a8b-a27c-84a738af3eb0	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 19:00:02.706+02	2023-04-30 19:00:02.706+02
4571e3a4-47e1-4e2e-b144-09663be002f3	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 19:00:02.782+02	2023-04-30 19:00:02.782+02
6f8d2b0e-8e77-42a5-a2b4-622267fb2830	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 19:00:13.088+02	2023-04-30 19:00:13.088+02
1564037b-c161-4304-856c-30a7f6c0c97e	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 19:00:13.116+02	2023-04-30 19:00:13.116+02
76a4bd58-ca86-4726-846b-ab178a29dd55	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 19:01:43.486+02	2023-04-30 19:01:43.486+02
97de3a7b-e059-4a7b-a298-d9106b786177	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 19:01:43.537+02	2023-04-30 19:01:43.537+02
42554c5e-1843-41a6-8240-d0d3cacbc4f2	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 19:01:53.862+02	2023-04-30 19:01:53.862+02
c3871585-9631-4e0e-b80a-06597e6fab16	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 19:01:53.889+02	2023-04-30 19:01:53.889+02
c2e04461-7395-401b-b976-d9623bc609a8	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 19:07:32.807+02	2023-04-30 19:07:32.807+02
a34c346d-aa3a-489a-9e79-e2d527c5f599	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 19:07:32.873+02	2023-04-30 19:07:32.873+02
76223201-9be2-4ecf-96ca-297fb265e937	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 19:07:43.14+02	2023-04-30 19:07:43.14+02
b1e9786b-7f33-4452-b54e-37b3eb5bea80	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 19:07:43.167+02	2023-04-30 19:07:43.167+02
14436ef5-631f-4a33-b221-03709666d411	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 21:16:35.76+02	2023-04-30 21:16:35.76+02
70b1534f-1dab-4693-a5a7-e94ee8b22ce4	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:16:43.379+02	2023-04-30 21:16:43.379+02
616beed5-8745-4ed5-8942-fea371bc1607	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:16:43.451+02	2023-04-30 21:16:43.451+02
8b3808b3-5097-4257-89a1-e74bef78ff60	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 21:19:43.433+02	2023-04-30 21:19:43.433+02
8400b71f-1e10-4424-a59f-7be5cc7bc59c	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 21:19:43.532+02	2023-04-30 21:19:43.532+02
16e905c5-b63d-41bd-aefa-0614eff7e88a	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:19:50.919+02	2023-04-30 21:19:50.919+02
46af8005-7f57-4635-99a1-0cab24081395	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:19:50.947+02	2023-04-30 21:19:50.947+02
fea918e6-c640-4abb-a2a8-3640172f95da	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 21:20:33.908+02	2023-04-30 21:20:33.908+02
011e2db3-14cf-46fd-8ddd-8df4a4087766	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 21:20:33.959+02	2023-04-30 21:20:33.959+02
a47fdbbd-7ff8-4769-91c4-2b419516fdde	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:20:41.245+02	2023-04-30 21:20:41.245+02
70a18b03-78c7-48cd-b0da-a1ccdbc3eadc	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:20:41.289+02	2023-04-30 21:20:41.289+02
66716571-4b2c-406d-9833-5834f4f6f317	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 21:21:18.113+02	2023-04-30 21:21:18.113+02
464ba5bb-5440-49b3-aece-8294d3172b4e	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 21:21:18.176+02	2023-04-30 21:21:18.176+02
7e13dc21-07a8-43c0-8388-7445085b9d1e	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:21:25.577+02	2023-04-30 21:21:25.577+02
b9879120-0c30-4f26-b3a4-0e0a25fffa8c	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:21:25.601+02	2023-04-30 21:21:25.601+02
5e6fd305-66ca-42dd-b44e-dbe5a7827455	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 21:23:57.077+02	2023-04-30 21:23:57.077+02
1b91161d-720b-4089-960b-f7ab3479721a	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 21:23:57.133+02	2023-04-30 21:23:57.133+02
33c506cd-32df-4fe2-8c40-572453521c4f	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:24:04.509+02	2023-04-30 21:24:04.509+02
53a1ac4e-db26-44ef-86f9-f32d05ec57e2	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:24:04.531+02	2023-04-30 21:24:04.531+02
11df2f9f-0517-4170-bfe9-a84fce31281f	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 21:25:59.003+02	2023-04-30 21:25:59.003+02
abc672cc-9ac1-49e5-8b05-2a13807a378e	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:26:06.347+02	2023-04-30 21:26:06.347+02
a58f9e33-1884-4706-b3b3-bd06c2f8a646	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:26:06.366+02	2023-04-30 21:26:06.366+02
5cc2bc44-8db7-468c-9720-39a439a265a8	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 21:29:03.324+02	2023-04-30 21:29:03.324+02
08682296-4d6a-4882-978f-ed433c7c6160	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 21:29:03.409+02	2023-04-30 21:29:03.409+02
77d60992-9017-4853-af0a-7c2e11e25739	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:29:10.88+02	2023-04-30 21:29:10.88+02
3bbd3bbc-9f0f-435e-aef3-1fc5972f5fae	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:29:10.905+02	2023-04-30 21:29:10.905+02
bb178f03-d496-4117-b76a-3aade8a31a31	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 21:30:22.233+02	2023-04-30 21:30:22.233+02
8ccff020-3b01-44c9-82d7-eaade422d04f	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 21:30:22.424+02	2023-04-30 21:30:22.424+02
6b1680e9-c4b5-4321-b46d-40d27a692f38	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:30:29.812+02	2023-04-30 21:30:29.812+02
2c13219c-7585-40d1-9bed-a956a6fc1ccc	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:30:29.84+02	2023-04-30 21:30:29.84+02
c33625e4-18ef-4493-bed3-a92f3fb67f10	info	User mary@gmail.com logged in	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"loginRequest":"mary@gmail.com"}	2023-04-30 21:33:54.951+02	2023-04-30 21:33:54.951+02
c4b353df-c781-4472-a7bc-6631a7b17f63	info	User mary@gmail.com viewed his  profile	9659b5be-2e67-4a39-ad4b-f525b91284ec	{"profile":{"id":"9659b5be-2e67-4a39-ad4b-f525b91284ec","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg","cover_image":"https://loremflickr.com/640/480","username":"Mary Doe","email":"mary@gmail.com","password":"$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6","role":"buyer","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2023-03-24T22:12:43.310Z","updatedAt":"2023-04-30T16:43:35.008Z"}}	2023-04-30 21:33:54.996+02	2023-04-30 21:33:54.996+02
c5789079-9513-460f-8d2c-9ec242278fb4	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:34:02.249+02	2023-04-30 21:34:02.249+02
a7757b33-9fd5-4c44-b616-efae0e784de4	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:34:02.267+02	2023-04-30 21:34:02.267+02
1d661a28-8f5e-4145-af29-e172cf2092a0	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:34:12.491+02	2023-04-30 21:34:12.491+02
fed075ea-f8bd-45eb-8852-918afb217a20	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:34:17.104+02	2023-04-30 21:34:17.104+02
7c3d3232-00c2-4a7d-bb3c-2a2498294bb6	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:34:21.438+02	2023-04-30 21:34:21.438+02
21205d3d-9e1d-45ac-a47d-206383b1e6e2	info	User jean@gmail.com logged out	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"logoutRequest":{}}	2023-04-30 21:34:23.094+02	2023-04-30 21:34:23.094+02
c2db39e5-2f4a-4d2a-8724-81c3f8c195c5	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:34:27.751+02	2023-04-30 21:34:27.751+02
312eac75-e0e6-4275-ad15-691fd59a493f	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:34:33.234+02	2023-04-30 21:34:33.234+02
2f62de99-4677-4b9a-907d-3c9d6105b839	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:34:33.262+02	2023-04-30 21:34:33.262+02
84d07de5-2e24-49f4-b920-2714d608672d	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:34:33.437+02	2023-04-30 21:34:33.437+02
7a9ba0ee-8dac-41c2-8c81-9b99bf0c74b6	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:34:33.453+02	2023-04-30 21:34:33.453+02
c151c0e2-3c7d-47d9-9a14-b26265f59309	info	User jean@gmail.com logged in	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"loginRequest":"jean@gmail.com"}	2023-04-30 21:34:33.547+02	2023-04-30 21:34:33.547+02
5e7ebf60-c5b5-4670-bb95-bb1756704138	info	User jean@gmail.com viewed his  profile	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"profile":{"id":"8cb8eb4a-1c4e-4795-81ff-e462c0bd1661","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg","cover_image":"https://loremflickr.com/640/480","username":"Jean Doe","email":"jean@gmail.com","password":"$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.","role":"seller","verified":true,"email_token":null,"gender":"female","mfa_enabled":false,"disabledUser":false,"mfa_code":null,"mfa_timeout":null,"mustUpdatePassword":false,"lastTimePasswordUpdated":"2023-04-30T16:43:24.614Z","createdAt":"2022-09-29T07:52:01.427Z","updatedAt":"2023-04-30T16:43:34.898Z"}}	2023-04-30 21:34:33.567+02	2023-04-30 21:34:33.567+02
a442ff6a-c88b-494a-89f4-7ec0adcaf9ca	info	User jean@gmail.com logged out	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	{"logoutRequest":{}}	2023-04-30 21:34:33.731+02	2023-04-30 21:34:33.731+02
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
20230402124807-create-log.js
20230406121722-create-subscriber.js
\.


--
-- Data for Name: Subscribers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subscribers" (id, email, "firstName", "lastName", subscribed, preferences, "verificationToken", "createdAt", "updatedAt") FROM stdin;
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
1	Consumer products	A consumer product is a finished product available for sale to a customer. There's a wide range of consumer products, and in marketing, they're typically divided into different types.	2023-04-30 18:43:35.073+02	2023-04-30 18:43:35.073+02
2	Industrial products	Businesses usually purchase an industrial product to make other products or to help them with running their business. An item that would be a consumer product if a customer bought it, such as cleaning supplies, may become an industrial product if a business buys it.	2023-04-30 18:43:35.073+02	2023-04-30 18:43:35.073+02
3	Service products	Service products are business offerings that are either a pure service or a core service. A pure service is a service without a tangible result, such as education, while a core service has a tangible result, like cleaning services. Some product categorizations place service products under industry products, but they can be their own type of product because many are available to consumers directly.	2023-04-30 18:43:35.073+02	2023-04-30 18:43:35.073+02
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "receiverId", "isRead", message, type, "createdAt", "updatedAt") FROM stdin;
3693fabd-4da5-49f8-97d8-23b7a1ca10cf	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	meanwhile Plastic male Security California Executive circuit innocent state Functionality	news	2023-04-30 18:43:36.047+02	2023-04-30 18:43:36.047+02
01176d1b-927b-4f5b-bc91-8278d67bde41	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	Executive repurpose Murphy West Utah jellyfish up Chips Forward Indium	payment	2023-04-30 18:43:36.047+02	2023-04-30 18:43:36.047+02
07586b4b-6da4-422e-bd81-4660d45c6118	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	whereas Killeen transparent Scandium Total mobile Cadillac blue Cambridgeshire customized	updates	2023-04-30 18:43:36.047+02	2023-04-30 18:43:36.047+02
139ff3a1-8d05-4bcf-899b-e1c8f5cf5c8d	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	Oregon withdrawal Bicycle deposit payment Electric invoice if program Northeast	news	2023-04-30 18:43:36.048+02	2023-04-30 18:43:36.048+02
0036d5f1-3e73-4dc3-b066-6912e02a3d95	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	SMTP Hyundai Steel Tricycle architect azure Ireland Convertible Fish alive	updates	2023-04-30 18:43:36.048+02	2023-04-30 18:43:36.048+02
b52ee7d4-0d75-4648-acf5-ddb7a7692522	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	yeast heuristic Salad Diesel loudly Baby tan Aruba Northeast tan	payment	2023-04-30 18:43:36.048+02	2023-04-30 18:43:36.048+02
c1136e5f-3493-4de7-b464-353f09f3e856	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	Lilangeni SUV deposit Lake Well Pizza Maserati forenenst embrace Southwest	payment	2023-04-30 18:43:36.049+02	2023-04-30 18:43:36.049+02
6dfdfe81-1ade-4df7-8659-386fe0bbc081	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	Northwest digital Bacon FTP Zachariah Strontium male Frozen buttery Southwest	news	2023-04-30 18:43:36.049+02	2023-04-30 18:43:36.049+02
2480cb3f-47e0-445f-88be-e24b5711cf98	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	blockchains Northeast Blues though whoa Carolina always East Texas Northwest	updates	2023-04-30 18:43:36.05+02	2023-04-30 18:43:36.05+02
57b490b7-4212-4760-81c6-2492bf526eae	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	program Marketing Michigan Dynamic green bluetooth index turquoise vertical perferendis	products	2023-04-30 18:43:36.05+02	2023-04-30 18:43:36.05+02
fdb01fc3-fb09-44a1-b165-c6e112400883	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	Bronze infinite visionary deposit Kids Silver Northeast Bike sensor reboot	products	2023-04-30 18:43:36.05+02	2023-04-30 18:43:36.05+02
c08aff61-82c0-4135-aa63-6d20be75b26c	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	Small Borders Steel system enable Mobility Loan quantify meter API	products	2023-04-30 18:43:36.051+02	2023-04-30 18:43:36.051+02
4b15f7fb-504d-4695-b24f-ba1f25d355ab	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	meter inasmuch Garden Tools Honda generally white navigate white Seaborgium	updates	2023-04-30 18:43:36.051+02	2023-04-30 18:43:36.051+02
caf7c9ac-d4ca-4dbc-a4ec-a4b6b0db318d	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	Crew Hybrid yuck Central Awesome exult beyond Trigender quantifying calculate	payment	2023-04-30 18:43:36.051+02	2023-04-30 18:43:36.051+02
f379cc5f-e24b-49e2-af0a-1fdf125f28d9	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	male Southeast satisfaction Administrator summary that solid asynchronous Ball dispose	news	2023-04-30 18:43:36.051+02	2023-04-30 18:43:36.051+02
3fbe7618-31ea-4e49-b54f-ea1044dab1c2	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	mobile Books XML AI Rustic Home Account Latin systems Arkansas	payment	2023-04-30 18:43:36.051+02	2023-04-30 18:43:36.051+02
e4dc48f3-5b88-41f7-8593-ce17fa07e42e	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	Avon Curium newton Hammond withdrawal under Loan Gasoline Manager couple	products	2023-04-30 18:43:36.052+02	2023-04-30 18:43:36.052+02
ff8e987f-e0eb-4d32-a697-5bbff158d770	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	newton markets Blues Pop below Loan Central unless compressing Games	updates	2023-04-30 18:43:36.052+02	2023-04-30 18:43:36.052+02
8fc7f2e7-5f48-4964-aa57-67a7e67d41f4	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	Face invoice iterate Music Accountability Milwaukee programming Einsteinium Northwest Tricycle	payment	2023-04-30 18:43:36.052+02	2023-04-30 18:43:36.052+02
5963b8af-632f-4aa6-ab63-1b45a82cc00a	9659b5be-2e67-4a39-ad4b-f525b91284ec	f	Home Savings maroon Health invoice Screen pfft female USB pace	payment	2023-04-30 18:43:36.052+02	2023-04-30 18:43:36.052+02
83292e4a-099d-412a-b2e3-6e33f2d21c04	3cfc76c8-191e-4cb1-a82f-e721e7314093	f	you have been assigned new role which is seller	user role updates	2023-04-30 18:52:57.34+02	2023-04-30 18:52:57.34+02
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" ("deliveryCountry", "deliveryCity", "deliveryStreet", "buyerId", id, "paymentMethod", "isPaid", status, "statusUpdated", "expectedDeliveryDate", "totalAmount", "createdAt", "updatedAt") FROM stdin;
Ghana	Maggiofurt	43207 Isom Mews	9659b5be-2e67-4a39-ad4b-f525b91284ec	27d114ae-b3ec-47df-b306-b2603ba73e78	mastercard	t	Processing	f	2023-04-30 18:43:35.707+02	11551.68	2023-04-30 18:43:35.707+02	2023-04-30 18:43:35.707+02
Western Sahara	Fort Brycen	0510 Wiegand Valley	9659b5be-2e67-4a39-ad4b-f525b91284ec	81a55034-6828-4c3c-aa8f-15cddc98799b	maestro	f	Pending	f	2023-04-30 18:43:35.707+02	62968.94	2023-04-30 18:43:35.707+02	2023-04-30 18:43:35.707+02
Fiji	Beierville	904 Terrill Port	9659b5be-2e67-4a39-ad4b-f525b91284ec	d1025c8c-3c7c-4b0d-8b47-3cf551e71c81	maestro	t	Processing	f	2023-04-30 18:43:35.708+02	27438.56	2023-04-30 18:43:35.708+02	2023-04-30 18:43:35.708+02
Yemen	Osinskiside	329 Ashleigh Skyway	9659b5be-2e67-4a39-ad4b-f525b91284ec	e6b66b14-941c-40b3-b396-7813f7607bdc	laser	t	Delivered	f	2023-04-30 18:43:35.708+02	40650.1	2023-04-30 18:43:35.708+02	2023-04-30 18:43:35.708+02
Malta	North Oniehaven	79874 Heathcote Place	9659b5be-2e67-4a39-ad4b-f525b91284ec	b04072f6-5cad-4888-9cb9-7b89d5bf04c1	american_express	t	Delivered	f	2023-04-30 18:43:35.708+02	9406.84	2023-04-30 18:43:35.708+02	2023-04-30 18:43:35.708+02
\.


--
-- Data for Name: orderitem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orderitem (quantity, "productId", "statusUpdated", "expectedDeliveryDate", "orderId", price, id) FROM stdin;
22092	b2ba98a8-ed1e-4b00-a760-1adc8be46148	f	\N	e6b66b14-941c-40b3-b396-7813f7607bdc	6659.92	90a3378f-d9a9-49f3-bd42-c1c759e67d22
32576	389a2778-3654-4267-be2b-332449654472	f	\N	81a55034-6828-4c3c-aa8f-15cddc98799b	82199.28	26501817-239f-4bfa-a2a5-c302eba624da
27835	69e8177e-f76b-4c31-ae78-6281bbadc41b	f	\N	d1025c8c-3c7c-4b0d-8b47-3cf551e71c81	62238.21	e0831440-c3f5-495c-b6a9-249ca79b6e0b
90972	ae7347c9-57bd-43a9-87e7-fbc460b9f5cf	f	\N	27d114ae-b3ec-47df-b306-b2603ba73e78	53114.27	268d2278-4804-433f-ac78-1810e2c47f63
30	69e8177e-f76b-4c31-ae78-6281bbadc41b	f	\N	d1025c8c-3c7c-4b0d-8b47-3cf551e71c81	57256.36	66999dc3-5a03-4544-9ed8-28077d47b5f1
84300	b2ba98a8-ed1e-4b00-a760-1adc8be46148	f	\N	81a55034-6828-4c3c-aa8f-15cddc98799b	42177.82	9d1f5de4-86a9-4904-b698-3c8900d557ba
87538	9d0d6a63-91d9-4a3e-8fdf-e77b1dac919a	f	\N	b04072f6-5cad-4888-9cb9-7b89d5bf04c1	21700.78	452ef9de-5fda-4969-9fbd-e4c79b6967b7
68326	69e8177e-f76b-4c31-ae78-6281bbadc41b	f	\N	d1025c8c-3c7c-4b0d-8b47-3cf551e71c81	33914.87	036e36f8-f10b-43aa-8704-b5b7352137c6
49042	389a2778-3654-4267-be2b-332449654472	f	\N	e6b66b14-941c-40b3-b396-7813f7607bdc	41321.67	5d9c6146-ac0f-4672-aeaf-a8c235fbe0f6
95842	ae7347c9-57bd-43a9-87e7-fbc460b9f5cf	f	\N	27d114ae-b3ec-47df-b306-b2603ba73e78	75461.93	a1e58767-e90c-4d83-bf3b-7ee176aaa6a1
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, amount, "orderId", method, discount, "stripeId", "createdAt", "updatedAt") FROM stdin;
d086b79d-4e6b-4e4d-9793-18739e3296d3	11551.68	27d114ae-b3ec-47df-b306-b2603ba73e78	mastercard	0	cs_test_b1nnYG4jFlA1axzKRhj1LJrlcLig2yiFGnTxTWaX7SYCPeitfqRSoECsKA	2023-04-26 18:44:54.378+02	2023-04-26 18:44:54.378+02
880a96e0-7e8e-4f8d-97e3-e8a1b84d229d	27438.56	d1025c8c-3c7c-4b0d-8b47-3cf551e71c81	maestro	0	cs_test_b1d1JN9wTy6gTs5ozmEoi2MGUb4GxFuImYh0GFnU5wywfuewsmCIEcWNHp	2023-04-28 21:16:17.542+02	2023-04-28 21:16:17.542+02
4675084e-c2d5-4f2e-ab6e-a7ce2e0d0f15	40650.1	e6b66b14-941c-40b3-b396-7813f7607bdc	laser	0	cs_test_b1uWxbyNLZui6eZZrGzAWbJbVgNIKqmPSat2k3ShviYJU0tiR9ubqm0OKb	2023-04-29 15:42:26.751+02	2023-04-29 15:42:26.751+02
b49588aa-0206-42f7-bf06-86eb31226387	9406.84	b04072f6-5cad-4888-9cb9-7b89d5bf04c1	american_express	0	cs_test_b1eTjuln2msGcGhx5fzA7eBVOpR6WJkx5Nkpd8VxGAK4RwKxwyqfBox5WM	2023-04-29 14:03:07.944+02	2023-04-29 14:03:07.944+02
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, images, name, description, quantity, "sellerId", exp_date, available, price, category, "createdAt", "updatedAt") FROM stdin;
b2ba98a8-ed1e-4b00-a760-1adc8be46148	{https://loremflickr.com/640/480,https://loremflickr.com/640/480,https://loremflickr.com/640/480}	Handcrafted Frozen Hat	The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive	69390	06dc1d7b-a427-43e4-8b82-22dcb6546001	2025-03-10 19:03:26.325+02	t	497	2	2023-04-30 18:43:35.646+02	2023-04-30 18:43:35.646+02
69e8177e-f76b-4c31-ae78-6281bbadc41b	{https://loremflickr.com/640/480,https://loremflickr.com/640/480,https://loremflickr.com/640/480}	Generic Steel Ball	The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality	27693	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	2024-07-04 03:26:01.393+02	t	600	1	2023-04-30 18:43:35.646+02	2023-04-30 18:43:35.646+02
ae7347c9-57bd-43a9-87e7-fbc460b9f5cf	{https://loremflickr.com/640/480,https://loremflickr.com/640/480,https://loremflickr.com/640/480}	Modern Granite Ball	Carbonite web goalkeeper gloves are ergonomically designed to give easy fit	29465	06dc1d7b-a427-43e4-8b82-22dcb6546001	2025-01-16 06:17:57.236+02	t	24	2	2023-04-30 18:43:35.646+02	2023-04-30 18:43:35.646+02
9d0d6a63-91d9-4a3e-8fdf-e77b1dac919a	{https://loremflickr.com/640/480,https://loremflickr.com/640/480,https://loremflickr.com/640/480}	Generic Metal Ball	The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients	3369	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	2025-04-02 20:54:49.255+02	t	238	3	2023-04-30 18:43:35.646+02	2023-04-30 18:43:35.646+02
389a2778-3654-4267-be2b-332449654472	{https://loremflickr.com/640/480,https://loremflickr.com/640/480,https://loremflickr.com/640/480}	Elegant Frozen Chips	The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design	44921	9659b5be-2e67-4a39-ad4b-f525b91284ec	2024-02-27 02:05:46.752+02	t	61	2	2023-04-30 18:43:35.646+02	2023-04-30 18:43:35.646+02
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, "productId", "userId", feedback, rating, "createdAt", "updatedAt") FROM stdin;
f30d7146-e9d4-4858-8272-2dbf57103fab	389a2778-3654-4267-be2b-332449654472	06dc1d7b-a427-43e4-8b82-22dcb6546001	Quo provident praesentium autem. Impedit dolorem sapiente atque. Ullam voluptates deleniti omnis necessitatibus rem aut. Repudiandae eligendi excepturi vero esse dolore enim quo. Dolor delectus mollitia delectus libero.	2	2023-04-30 18:43:35.66+02	2023-04-30 18:43:35.66+02
d7dc2b29-d3b0-4167-904b-9408ad530bc8	389a2778-3654-4267-be2b-332449654472	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	Quaerat eveniet ipsam cupiditate similique. Ullam cum molestiae expedita explicabo. Cumque perspiciatis ipsam repellendus quo porro aliquid. Dignissimos ipsam maxime suscipit officiis.	2	2023-04-30 18:43:35.66+02	2023-04-30 18:43:35.66+02
aa568e94-0573-4534-a843-827edb253b43	389a2778-3654-4267-be2b-332449654472	9659b5be-2e67-4a39-ad4b-f525b91284ec	Tempora odio voluptatum. Corrupti repudiandae vel. Quaerat dicta eius harum magnam quis autem voluptas cumque. Porro repellat incidunt debitis corporis porro quaerat qui maiores quod. Nostrum nostrum odio. Suscipit perspiciatis quibusdam quaerat.	1	2023-04-30 18:43:35.66+02	2023-04-30 18:43:35.66+02
65d48295-c8a7-4a79-8856-ef0db0fc16c8	ae7347c9-57bd-43a9-87e7-fbc460b9f5cf	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	Consequatur pariatur excepturi quo. Quis unde culpa alias hic perferendis pariatur aliquam. Placeat tempore doloremque necessitatibus quam at. Culpa quo quaerat possimus beatae cumque quisquam cupiditate iusto. Inventore error nostrum sint nostrum error quo. Repellendus aliquid cum magnam.	4	2023-04-30 18:43:35.661+02	2023-04-30 18:43:35.661+02
94d9162f-a83d-409c-a36e-8800e5735f6e	9d0d6a63-91d9-4a3e-8fdf-e77b1dac919a	5ff06976-e8c1-4d5f-b2e2-7cec35138e8a	Reiciendis et dolor ex corrupti quas magnam voluptatem corporis saepe. Facere repudiandae ex deserunt modi. Aut incidunt alias quo a a consequatur.	5	2023-04-30 18:43:35.661+02	2023-04-30 18:43:35.661+02
9125439e-e63b-40b3-8b3d-7fa6f4d683fc	9d0d6a63-91d9-4a3e-8fdf-e77b1dac919a	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	Repellat esse natus itaque tenetur voluptate facere magni temporibus. Illo eos laudantium asperiores. Cum sit unde voluptatibus omnis nesciunt porro corporis. Consequuntur labore quibusdam assumenda esse minus iste. Eos aperiam enim aut error id similique sunt.	5	2023-04-30 18:43:35.661+02	2023-04-30 18:43:35.661+02
01a942ba-a4d0-4788-9eb9-23f9b3266d3e	ae7347c9-57bd-43a9-87e7-fbc460b9f5cf	06dc1d7b-a427-43e4-8b82-22dcb6546001	Ipsum fugiat ipsa atque error beatae. Autem atque numquam quasi exercitationem ea aliquid tempora.	3	2023-04-30 18:43:35.661+02	2023-04-30 18:43:35.661+02
033822b8-a097-41b1-abb7-521e07064e64	389a2778-3654-4267-be2b-332449654472	06dc1d7b-a427-43e4-8b82-22dcb6546001	Suscipit ratione pariatur incidunt accusamus amet unde quia sequi. Ducimus qui corporis earum mollitia molestiae delectus eaque.	3	2023-04-30 18:43:35.661+02	2023-04-30 18:43:35.661+02
928481e5-e340-4b80-951d-215ed92b3ff2	ae7347c9-57bd-43a9-87e7-fbc460b9f5cf	9659b5be-2e67-4a39-ad4b-f525b91284ec	Facere nihil harum. Possimus laudantium nam. Reprehenderit soluta hic iste numquam. Repudiandae molestias esse porro nam accusantium doloremque molestias vero. Eligendi possimus laudantium quisquam quaerat nostrum.	5	2023-04-30 18:43:35.661+02	2023-04-30 18:43:35.661+02
ca4a8bea-e0d6-4aeb-9600-0bc2474cb00b	69e8177e-f76b-4c31-ae78-6281bbadc41b	9659b5be-2e67-4a39-ad4b-f525b91284ec	Consequatur voluptas aut ea numquam exercitationem numquam facere. Quas optio vitae nam aut eveniet commodi totam tenetur. Autem laboriosam harum non aut perspiciatis. Ipsa fuga eius. At reprehenderit recusandae fugiat nam nulla.	5	2023-04-30 18:43:35.661+02	2023-04-30 18:43:35.661+02
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, avatar, cover_image, username, email, password, role, gender, verified, email_token, "isEmailVerified", "createdAt", "updatedAt", "mustUpdatePassword", "lastTimePasswordUpdated", "resetPasswordToken", "resetPasswordExpires", mfa_enabled, "disabledUser", mfa_code, mfa_timeout) FROM stdin;
06dc1d7b-a427-43e4-8b82-22dcb6546001	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/793.jpg	https://loremflickr.com/640/480	brogrammer	brogrammer@gmail.com	$2b$10$P27tGW7b3sVuXqeV2h4V8eQMhoJRFnDVXzELO4BO1oWeCnpo/JvXi	admin	none	t	\N	f	2023-03-27 08:18:06.773+02	2023-04-30 18:43:34.604+02	f	2023-04-30 18:43:24.614+02	\N	\N	f	f	\N	\N
5ff06976-e8c1-4d5f-b2e2-7cec35138e8a	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/264.jpg	https://loremflickr.com/640/480	John Doe	john@gmail.com	$2b$10$b5H/RojhB1VAsImRm6wHluECoGalJQFBuJJ3BximkiHizjG0iqz86	seller	male	t	\N	f	2023-02-15 13:25:05.216+02	2023-04-30 18:43:34.676+02	f	2023-04-30 18:43:24.614+02	\N	\N	f	f	\N	\N
8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1012.jpg	https://loremflickr.com/640/480	Jean Doe	jean@gmail.com	$2b$10$jqzpTrYpZKS9QhFOTHAU5O/dElgfYiG29CXemszq4beif3C9DLKB.	seller	female	t	\N	f	2022-09-29 09:52:01.427+02	2023-04-30 18:43:34.898+02	f	2023-04-30 18:43:24.614+02	\N	\N	f	f	\N	\N
9659b5be-2e67-4a39-ad4b-f525b91284ec	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/735.jpg	https://loremflickr.com/640/480	Mary Doe	mary@gmail.com	$2b$10$VJhrbOs1E9Jpvck9waDp5OIb1CYfAg9TuoBU.G6WmnP3.bTYaPaA6	buyer	female	t	\N	f	2023-03-25 00:12:43.31+02	2023-04-30 18:43:35.008+02	f	2023-04-30 18:43:24.614+02	\N	\N	f	f	\N	\N
3cfc76c8-191e-4cb1-a82f-e721e7314093	https://t3.ftcdn.net/jpg/01/28/56/34/360_F_128563455_bGrVZnfDCL0PxH1sU33NpOhGcCc1M7qo.jpg	https://cdn.conceptartempire.com/images/360/01-concept-art-video-game-item-shop.jpg	blackd44	irabd44@gmail.com	$2b$10$4QdTQ.YtQoR5n3yKEniY1.k0PFiNdAoJPjGxn7SVtzNMUKJxQ3Foe	seller	Male	t	\N	f	2023-04-30 18:51:16.176+02	2023-04-30 18:52:57.323+02	f	2023-04-30 18:44:17.176+02	\N	\N	f	f	\N	2023-04-30 18:51:16.171+02
a3af3a51-fe0c-45fe-899d-4ef2a3cead47	https://t3.ftcdn.net/jpg/01/28/56/34/360_F_128563455_bGrVZnfDCL0PxH1sU33NpOhGcCc1M7qo.jpg	https://cdn.conceptartempire.com/images/360/01-concept-art-video-game-item-shop.jpg	test email	test_en8yw_17713@example.com	$2b$10$RjnGJCJiq.vjPqadnavk2.KlzsJMeF4iOMbDmnc3S9WYp9xamJFK2	buyer	Female	f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYTNhZjNhNTEtZmUwYy00NWZlLTg5OWQtNGVmMmEzY2VhZDQ3IiwiYXZhdGFyIjoiaHR0cHM6Ly90My5mdGNkbi5uZXQvanBnLzAxLzI4LzU2LzM0LzM2MF9GXzEyODU2MzQ1NV9iR3JWWm5mRENMMFB4SDFzVTMzTnBPaEdjQ2MxTTdxby5qcGciLCJjb3Zlcl9pbWFnZSI6Imh0dHBzOi8vY2RuLmNvbmNlcHRhcnRlbXBpcmUuY29tL2ltYWdlcy8zNjAvMDEtY29uY2VwdC1hcnQtdmlkZW8tZ2FtZS1pdGVtLXNob3AuanBnIiwicm9sZSI6ImJ1eWVyIiwidmVyaWZpZWQiOmZhbHNlLCJlbWFpbF90b2tlbiI6ImZhbHNlIiwibWZhX2VuYWJsZWQiOmZhbHNlLCJkaXNhYmxlZFVzZXIiOmZhbHNlLCJtZmFfdGltZW91dCI6IjIwMjMtMDQtMzBUMTk6MzM6NTQuNjYwWiIsIm11c3RVcGRhdGVQYXNzd29yZCI6ZmFsc2UsImxhc3RUaW1lUGFzc3dvcmRVcGRhdGVkIjoiMjAyMy0wNC0zMFQxNjo0NDoxNy4xNzZaIiwidXNlcm5hbWUiOiJ0ZXN0IGVtYWlsIiwiZW1haWwiOiJ0ZXN0X2VuOHl3XzE3NzEzQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkUmpuR0pDSmlxLnZqUHFhZG5hdmsyLktsenNKTWVGNGlPTWJEbW5jM1M5V1lwOXhhbUpGSzIiLCJnZW5kZXIiOiJGZW1hbGUiLCJ1cGRhdGVkQXQiOiIyMDIzLTA0LTMwVDE5OjMzOjU0LjY2MVoiLCJjcmVhdGVkQXQiOiIyMDIzLTA0LTMwVDE5OjMzOjU0LjY2MVoiLCJtZmFfY29kZSI6bnVsbH0sImlhdCI6MTY4Mjg4MzIzNCwiZXhwIjoxNjgyODg2ODM0fQ.NoC5sJgdhm_HTl-fbcU5zEvhX6q11ueogLqVl5fcUK0	f	2023-04-30 21:33:54.661+02	2023-04-30 21:33:54.713+02	f	2023-04-30 18:44:17.176+02	\N	\N	f	f	\N	2023-04-30 21:33:54.66+02
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlists (id, "userId", "productId", "createdAt", "updatedAt") FROM stdin;
8133ab5a-c47e-4eac-9a83-030b4146e1d4	5ff06976-e8c1-4d5f-b2e2-7cec35138e8a	ae7347c9-57bd-43a9-87e7-fbc460b9f5cf	2023-04-30 18:43:36.142+02	2023-04-30 18:43:36.142+02
9c47b078-0155-45aa-9c18-cc738e413cc8	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	b2ba98a8-ed1e-4b00-a760-1adc8be46148	2023-04-30 18:43:36.142+02	2023-04-30 18:43:36.142+02
a2ac0cc1-f0be-4945-ab9b-a65ca9b14012	5ff06976-e8c1-4d5f-b2e2-7cec35138e8a	b2ba98a8-ed1e-4b00-a760-1adc8be46148	2023-04-30 18:43:36.142+02	2023-04-30 18:43:36.142+02
bf20fb4a-81ce-4b64-8d59-c3f75491549c	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	ae7347c9-57bd-43a9-87e7-fbc460b9f5cf	2023-04-30 18:43:36.142+02	2023-04-30 18:43:36.142+02
6aebafe9-df19-457b-884c-5dcf948ae500	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	389a2778-3654-4267-be2b-332449654472	2023-04-30 18:43:36.142+02	2023-04-30 18:43:36.142+02
bb08eb10-fa6b-4437-8af6-cc1ddb615051	5ff06976-e8c1-4d5f-b2e2-7cec35138e8a	389a2778-3654-4267-be2b-332449654472	2023-04-30 18:43:36.142+02	2023-04-30 18:43:36.142+02
af62ff24-27d5-44ac-97ba-43b3902febbf	06dc1d7b-a427-43e4-8b82-22dcb6546001	389a2778-3654-4267-be2b-332449654472	2023-04-30 18:43:36.142+02	2023-04-30 18:43:36.142+02
84a68780-8458-48cd-8eeb-d12905b35171	8cb8eb4a-1c4e-4795-81ff-e462c0bd1661	389a2778-3654-4267-be2b-332449654472	2023-04-30 18:43:36.142+02	2023-04-30 18:43:36.142+02
4d6eaeee-ff68-49b8-806f-8b3947df0eba	9659b5be-2e67-4a39-ad4b-f525b91284ec	ae7347c9-57bd-43a9-87e7-fbc460b9f5cf	2023-04-30 18:43:36.143+02	2023-04-30 18:43:36.143+02
5013dee4-a6e0-4dac-81c2-2f9cc4371a52	5ff06976-e8c1-4d5f-b2e2-7cec35138e8a	389a2778-3654-4267-be2b-332449654472	2023-04-30 18:43:36.143+02	2023-04-30 18:43:36.143+02
\.


--
-- Name: Blockedtokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Blockedtokens_id_seq"', 2, true);


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
-- Name: Log Log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Log"
    ADD CONSTRAINT "Log_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Subscribers Subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscribers"
    ADD CONSTRAINT "Subscribers_email_key" UNIQUE (email);


--
-- Name: Subscribers Subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscribers"
    ADD CONSTRAINT "Subscribers_pkey" PRIMARY KEY (id);


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
-- Name: Log Log_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Log"
    ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: carts carts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


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

