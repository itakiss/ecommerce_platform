--
-- PostgreSQL database dump
--

-- Dumped from database version 17rc1
-- Dumped by pg_dump version 17rc1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_product_ratings(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_product_ratings() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Update avg_rating and total_reviews for the product
  UPDATE products
  SET 
    avg_rating = (SELECT AVG(rating) FROM user_reviews WHERE product_id = NEW.product_id),
    total_reviews = (SELECT COUNT(*) FROM user_reviews WHERE product_id = NEW.product_id)
  WHERE product_id = NEW.product_id;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_product_ratings() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: billing_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.billing_info (
    billing_id integer NOT NULL,
    address text NOT NULL,
    city character varying(100) NOT NULL,
    country character varying(100) NOT NULL,
    postal_code character varying(20) NOT NULL,
    payment_method character varying(50) NOT NULL,
    preferred_billing boolean DEFAULT false,
    user_id uuid
);


ALTER TABLE public.billing_info OWNER TO postgres;

--
-- Name: billing_info_billing_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.billing_info_billing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.billing_info_billing_id_seq OWNER TO postgres;

--
-- Name: billing_info_billing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.billing_info_billing_id_seq OWNED BY public.billing_info.billing_id;


--
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    brand_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- Name: brands_brand_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brands_brand_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_brand_id_seq OWNER TO postgres;

--
-- Name: brands_brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brands_brand_id_seq OWNED BY public.brands.brand_id;


--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    cart_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id uuid
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cart_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_cart_id_seq OWNER TO postgres;

--
-- Name: cart_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_cart_id_seq OWNED BY public.cart.cart_id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    cart_item_id integer NOT NULL,
    cart_id integer NOT NULL,
    variant_id integer NOT NULL,
    quantity integer DEFAULT 1,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_cart_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_cart_item_id_seq OWNER TO postgres;

--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_cart_item_id_seq OWNED BY public.cart_items.cart_item_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    favorite_id integer NOT NULL,
    variant_id integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id uuid
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: favorites_favorite_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_favorite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_favorite_id_seq OWNER TO postgres;

--
-- Name: favorites_favorite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_favorite_id_seq OWNED BY public.favorites.favorite_id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    order_item_id integer NOT NULL,
    order_id integer NOT NULL,
    variant_id integer NOT NULL,
    quantity integer NOT NULL,
    price_per_unit numeric(10,2) NOT NULL,
    total_price numeric(10,2) GENERATED ALWAYS AS (((quantity)::numeric * price_per_unit)) STORED
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_order_item_id_seq OWNER TO postgres;

--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_order_item_id_seq OWNED BY public.order_items.order_item_id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    order_status character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id uuid
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    image_id integer NOT NULL,
    image_url character varying(255) NOT NULL,
    alt_text character varying(255),
    is_main boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    variant_id integer
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: product_images_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_image_id_seq OWNER TO postgres;

--
-- Name: product_images_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_image_id_seq OWNED BY public.product_images.image_id;


--
-- Name: product_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_tags (
    product_id integer NOT NULL,
    tag character varying(255) NOT NULL
);


ALTER TABLE public.product_tags OWNER TO postgres;

--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    variant_id integer NOT NULL,
    product_id integer NOT NULL,
    bottle_size numeric(5,2) NOT NULL,
    price numeric(10,2) NOT NULL,
    quantity_in_stock integer DEFAULT 0,
    sku character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- Name: product_variants_variant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variants_variant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_variants_variant_id_seq OWNER TO postgres;

--
-- Name: product_variants_variant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variants_variant_id_seq OWNED BY public.product_variants.variant_id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    gender character varying(50) NOT NULL,
    brand_id integer,
    category_id integer,
    avg_rating numeric(2,1) DEFAULT 0,
    total_reviews integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_avg_rating_check CHECK (((avg_rating >= (0)::numeric) AND (avg_rating <= (5)::numeric)))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expire timestamp without time zone,
    user_id uuid,
    sess json NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: shipping_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_info (
    shipping_id integer NOT NULL,
    address text NOT NULL,
    city character varying(100) NOT NULL,
    country character varying(100) NOT NULL,
    postal_code character varying(20) NOT NULL,
    preferred_shipping boolean DEFAULT false,
    user_id uuid
);


ALTER TABLE public.shipping_info OWNER TO postgres;

--
-- Name: shipping_info_shipping_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shipping_info_shipping_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shipping_info_shipping_id_seq OWNER TO postgres;

--
-- Name: shipping_info_shipping_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shipping_info_shipping_id_seq OWNED BY public.shipping_info.shipping_id;


--
-- Name: user_information; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_information (
    user_information_id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    phone_number character varying(15),
    user_id uuid
);


ALTER TABLE public.user_information OWNER TO postgres;

--
-- Name: user_information_user_information_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_information_user_information_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_information_user_information_id_seq OWNER TO postgres;

--
-- Name: user_information_user_information_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_information_user_information_id_seq OWNED BY public.user_information.user_information_id;


--
-- Name: user_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_reviews (
    review_id integer NOT NULL,
    product_id integer NOT NULL,
    rating integer,
    review_text text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id uuid,
    CONSTRAINT user_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.user_reviews OWNER TO postgres;

--
-- Name: user_reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_reviews_review_id_seq OWNER TO postgres;

--
-- Name: user_reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_reviews_review_id_seq OWNED BY public.user_reviews.review_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying(50) NOT NULL,
    hashed_password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification_tokens (
    token_id integer NOT NULL,
    verification_token character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id uuid
);


ALTER TABLE public.verification_tokens OWNER TO postgres;

--
-- Name: verification_tokens_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.verification_tokens_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.verification_tokens_token_id_seq OWNER TO postgres;

--
-- Name: verification_tokens_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.verification_tokens_token_id_seq OWNED BY public.verification_tokens.token_id;


--
-- Name: billing_info billing_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_info ALTER COLUMN billing_id SET DEFAULT nextval('public.billing_info_billing_id_seq'::regclass);


--
-- Name: brands brand_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands ALTER COLUMN brand_id SET DEFAULT nextval('public.brands_brand_id_seq'::regclass);


--
-- Name: cart cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN cart_id SET DEFAULT nextval('public.cart_cart_id_seq'::regclass);


--
-- Name: cart_items cart_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN cart_item_id SET DEFAULT nextval('public.cart_items_cart_item_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: favorites favorite_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN favorite_id SET DEFAULT nextval('public.favorites_favorite_id_seq'::regclass);


--
-- Name: order_items order_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN order_item_id SET DEFAULT nextval('public.order_items_order_item_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: product_images image_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN image_id SET DEFAULT nextval('public.product_images_image_id_seq'::regclass);


--
-- Name: product_variants variant_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN variant_id SET DEFAULT nextval('public.product_variants_variant_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: shipping_info shipping_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_info ALTER COLUMN shipping_id SET DEFAULT nextval('public.shipping_info_shipping_id_seq'::regclass);


--
-- Name: user_information user_information_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_information ALTER COLUMN user_information_id SET DEFAULT nextval('public.user_information_user_information_id_seq'::regclass);


--
-- Name: user_reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_reviews ALTER COLUMN review_id SET DEFAULT nextval('public.user_reviews_review_id_seq'::regclass);


--
-- Name: verification_tokens token_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_tokens ALTER COLUMN token_id SET DEFAULT nextval('public.verification_tokens_token_id_seq'::regclass);


--
-- Name: billing_info billing_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_info
    ADD CONSTRAINT billing_info_pkey PRIMARY KEY (billing_id);


--
-- Name: brands brands_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_name_key UNIQUE (name);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (brand_id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (cart_item_id);


--
-- Name: cart_items cart_items_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_unique UNIQUE (cart_id, variant_id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (cart_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (favorite_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (image_id);


--
-- Name: product_tags product_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_pkey PRIMARY KEY (product_id, tag);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (variant_id);


--
-- Name: product_variants product_variants_sku_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_sku_key UNIQUE (sku);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: session sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: shipping_info shipping_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_info
    ADD CONSTRAINT shipping_info_pkey PRIMARY KEY (shipping_id);


--
-- Name: cart unique_user_cart; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT unique_user_cart UNIQUE (user_id);


--
-- Name: user_information user_information_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_information
    ADD CONSTRAINT user_information_pkey PRIMARY KEY (user_information_id);


--
-- Name: user_information user_information_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_information
    ADD CONSTRAINT user_information_user_id_key UNIQUE (user_id);


--
-- Name: user_reviews user_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_reviews
    ADD CONSTRAINT user_reviews_pkey PRIMARY KEY (review_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_user_id_temp_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_id_temp_unique UNIQUE (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: verification_tokens verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (token_id);


--
-- Name: idx_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cart_id ON public.cart USING btree (cart_id);


--
-- Name: idx_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_id ON public.orders USING btree (order_id);


--
-- Name: idx_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_id ON public.products USING btree (product_id);


--
-- Name: idx_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_id ON public.users USING btree (user_id);


--
-- Name: idx_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_variant_id ON public.product_variants USING btree (variant_id);


--
-- Name: user_reviews trigger_update_product_ratings; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_product_ratings AFTER INSERT OR UPDATE ON public.user_reviews FOR EACH ROW EXECUTE FUNCTION public.update_product_ratings();


--
-- Name: billing_info fk_billing_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_info
    ADD CONSTRAINT fk_billing_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: products fk_brand; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES public.brands(brand_id) ON DELETE SET NULL;


--
-- Name: cart_items fk_cart; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES public.cart(cart_id);


--
-- Name: cart_items fk_cart_item_cart; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) REFERENCES public.cart(cart_id) ON DELETE CASCADE;


--
-- Name: cart_items fk_cart_item_variant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_cart_item_variant FOREIGN KEY (variant_id) REFERENCES public.product_variants(variant_id) ON DELETE CASCADE;


--
-- Name: cart fk_cart_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: products fk_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE SET NULL;


--
-- Name: favorites fk_favorite_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorite_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: favorites fk_favorite_variant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_favorite_variant FOREIGN KEY (variant_id) REFERENCES public.product_variants(variant_id) ON DELETE CASCADE;


--
-- Name: order_items fk_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- Name: order_items fk_order_item_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: order_items fk_order_item_variant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_order_item_variant FOREIGN KEY (variant_id) REFERENCES public.product_variants(variant_id) ON DELETE CASCADE;


--
-- Name: orders fk_order_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: product_variants fk_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: order_items fk_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_product FOREIGN KEY (variant_id) REFERENCES public.product_variants(variant_id);


--
-- Name: product_images fk_product_image; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT fk_product_image FOREIGN KEY (variant_id) REFERENCES public.product_variants(variant_id);


--
-- Name: user_reviews fk_review_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_reviews
    ADD CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: user_reviews fk_review_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_reviews
    ADD CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: shipping_info fk_shipping_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_info
    ADD CONSTRAINT fk_shipping_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: product_tags fk_tag_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT fk_tag_product FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: verification_tokens fk_token_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: user_information fk_user_info_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_information
    ADD CONSTRAINT fk_user_info_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: product_variants fk_variant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT fk_variant FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: product_images fk_variant_image; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT fk_variant_image FOREIGN KEY (variant_id) REFERENCES public.product_variants(variant_id) ON DELETE CASCADE;


--
-- Name: session sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

