create table users (
    username varchar(50) not null primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    email varchar(80) not null,
    password_hash varchar(200) not null,
    is_banned int default 0
);

create table heroes (
    hero_name varchar(50) not null primary key,
    domain varchar(20) not null,
    alignment varchar(10) not null,
    eye_color varchar(50) not null,
    hair_color varchar(50) not null,
    photo_url varchar(100) not null,
    ability_name varchar(20) not null
);

create table users_heroes_list (
    user_pk varchar(50) not null,
    hero_pk varchar(50) not null,
    constraint fk_user_name foreign key (user_pk) references users(username),
    constraint fk_hero_name foreign key (hero_pk) references heroes(hero_name)
);

/*
* Daca nu merge cu multi-column primary key, lasa-l fara. After all, e cam greu sa iesi cu acelasi scor de mai multe ori, but it can be possible so no worries there.
*/
create table leaderboard (
    username varchar(50) not null,
    score int not null,
    hero varchar(50) not null,
    constraint fk_username foreign key (username) references users(username),
    constraint fk_hero foreign key (hero) references heroes(hero_name),
    constraint row_pk primary key(username, score, hero)
);

/*
* The difficulty is one of the following:
* 1 - easy
* 2 - medium
* 3 - hard
* 4 - expert
*/
create table questions (
    id serial primary key,
    domain varchar(20) not null,
    difficulty int not null,
    content varchar(400) not null,
    answer_a varchar(100) not null,
    answer_b varchar(100) not null,
    answer_c varchar(100) not null,
    answer_d varchar(100) not null,
    correct_answer varchar(1) not null
);

create table admins (
    username varchar(50) not null primary key,
    password_hash varchar(50) not null
);