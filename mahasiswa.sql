-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.jurusan (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  kode character varying NOT NULL UNIQUE,
  nama_jurusan character varying NOT NULL,
  fakultas_id bigint,
  CONSTRAINT jurusan_pkey PRIMARY KEY (id),
  CONSTRAINT fk_fakultas FOREIGN KEY (fakultas_id) REFERENCES public.fakultas(id)
);
CREATE TABLE public.mahasiswa (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nim character varying NOT NULL UNIQUE,
  nama character varying NOT NULL,
  email character varying UNIQUE,
  no_hp character varying,
  jenis_kelamin USER-DEFINED,
  tempat_lahir character varying,
  tanggal_lahir date,
  alamat text,
  jurusan_id bigint NOT NULL,
  angkatan integer,
  semester integer,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  fakultas_id bigint,
  CONSTRAINT mahasiswa_pkey PRIMARY KEY (id),
  CONSTRAINT fk_jurusan FOREIGN KEY (jurusan_id) REFERENCES public.jurusan(id),
  CONSTRAINT fk_mahasiswa_fakultas FOREIGN KEY (fakultas_id) REFERENCES public.fakultas(id)
);
CREATE TABLE public.fakultas (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  kode character varying NOT NULL UNIQUE,
  nama_fakultas character varying NOT NULL,
  CONSTRAINT fakultas_pkey PRIMARY KEY (id)
);