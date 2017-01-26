/*==============================================================*/
/* DBMS name:      PostgreSQL VVG                               */
/* Created on:     26.01.2017 19:36:29                          */
/*==============================================================*/


/*==============================================================*/
/* Table: Agent                                                 */
/*==============================================================*/
create table Agent (
   cAgent               SERIAL               not null,
   Agent                VARCHAR(1024)        null,
   Memo                 TEXT                 null
);

comment on table Agent is
'Средство/среда контакта - email, messenger, chat...';

alter table Agent
   add constraint PK_AGENT primary key (cAgent);

/*==============================================================*/
/* Index: ipk_Agent                                             */
/*==============================================================*/
create unique index ipk_Agent on Agent (
cAgent
);

/*==============================================================*/
/* Table: Contact                                               */
/*==============================================================*/
create table Contact (
   cContact             SERIAL               not null,
   cAgent               INT4                 null,
   pId                  UUID                 null,
   key                  VARCHAR(1024)        null,
   phrase               VARCHAR(1024)        null,
   Memo                 TEXT                 null,
   stateId              BOOL                 null
);

alter table Contact
   add constraint PK_CONTACT primary key (cContact);

/*==============================================================*/
/* Index: ipk_Contact                                           */
/*==============================================================*/
create unique index ipk_Contact on Contact (
cContact
);

/*==============================================================*/
/* Index: ifk_have                                              */
/*==============================================================*/
create  index ifk_have on Contact (
pId
);

/*==============================================================*/
/* Index: ifk_dets                                              */
/*==============================================================*/
create  index ifk_dets on Contact (
cAgent
);

/*==============================================================*/
/* Table: State                                                 */
/*==============================================================*/
create table State (
   cState               SERIAL               not null,
   State                VARCHAR(1024)        null,
   State_en             VARCHAR(1024)        null
);

alter table State
   add constraint PK_STATE primary key (cState);

/*==============================================================*/
/* Index: ipk_State                                             */
/*==============================================================*/
create unique index ipk_State on State (
cState
);

/*==============================================================*/
/* Table: access                                                */
/*==============================================================*/
create table access (
   cOper                INT4                 not null,
   pId                  UUID                 not null,
   stateId              BOOL                 null
);

alter table access
   add constraint PK_ACCESS primary key (cOper, pId);

/*==============================================================*/
/* Index: ifk_detby                                             */
/*==============================================================*/
create  index ifk_detby on access (
cOper
);

/*==============================================================*/
/* Index: ifk_get                                               */
/*==============================================================*/
create  index ifk_get on access (
pId
);

/*==============================================================*/
/* Table: audioDatа                                             */
/*==============================================================*/
create table audioDatа (
   pId                  UUID                 not null,
   audioFull            CHAR(254)            null,
   audioMemo            CHAR(254)            null,
   Memo                 TEXT                 null
);

alter table audioDatа
   add constraint PK_AUDIODATА primary key (pId);

/*==============================================================*/
/* Index: ifk_voice                                             */
/*==============================================================*/
create  index ifk_voice on audioDatа (
pId
);

/*==============================================================*/
/* Table: doc                                                   */
/*==============================================================*/
create table doc (
   cDoc                 SERIAL               not null,
   cSpec                INT4                 null,
   pId                  UUID                 null,
   cState               INT4                 null,
   docN                 VARCHAR(1024)        null,
   docDate              DATE                 null,
   docEnd               DATE                 null,
   docAuth              VARCHAR(1024)        null,
   Memo                 TEXT                 null
);

alter table doc
   add constraint PK_DOC primary key (cDoc);

/*==============================================================*/
/* Index: ipk_doc                                               */
/*==============================================================*/
create unique index ipk_doc on doc (
cDoc
);

/*==============================================================*/
/* Index: ifk_Relationship_1                                    */
/*==============================================================*/
create  index ifk_Relationship_1 on doc (
cSpec
);

/*==============================================================*/
/* Index: ifk_docState                                          */
/*==============================================================*/
create  index ifk_docState on doc (
cState
);

/*==============================================================*/
/* Index: ifk_owner                                             */
/*==============================================================*/
create  index ifk_owner on doc (
pId
);

/*==============================================================*/
/* Table: docImage                                              */
/*==============================================================*/
create table docImage (
   pageN                INT2                 not null,
   cDoc                 INT4                 not null,
   image                CHAR(254)            null
);

alter table docImage
   add constraint PK_DOCIMAGE primary key (pageN);

/*==============================================================*/
/* Index: ipk_docImage                                          */
/*==============================================================*/
create unique index ipk_docImage on docImage (
pageN
);

/*==============================================================*/
/* Index: ifk_pics                                              */
/*==============================================================*/
create  index ifk_pics on docImage (
cDoc
);

/*==============================================================*/
/* Table: docSpec                                               */
/*==============================================================*/
create table docSpec (
   cSpec                SERIAL               not null,
   spec                 VARCHAR(1024)        null,
   spec_en              VARCHAR(1024)        null
);

alter table docSpec
   add constraint PK_DOCSPEC primary key (cSpec);

/*==============================================================*/
/* Index: ipk_docSpec                                           */
/*==============================================================*/
create unique index ipk_docSpec on docSpec (
cSpec
);

/*==============================================================*/
/* Table: opRule                                                */
/*==============================================================*/
create table opRule (
   cRule                SERIAL               not null,
   Rule                 VARCHAR(1024)        null,
   Rule_en              VARCHAR(1024)        null
);

alter table opRule
   add constraint PK_OPRULE primary key (cRule);

/*==============================================================*/
/* Index: ipk_opRule                                            */
/*==============================================================*/
create unique index ipk_opRule on opRule (
cRule
);

/*==============================================================*/
/* Table: operator                                              */
/*==============================================================*/
create table operator (
   cOper                SERIAL               not null,
   cRule                INT4                 null,
   cPoint               INT4                 null,
   Stuff                VARCHAR(1024)        null,
   Stuff_en             VARCHAR(1024)        null,
   key                  VARCHAR(1024)        null,
   phrase               VARCHAR(1024)        null,
   stateId              BOOL                 null
);

alter table operator
   add constraint PK_OPERATOR primary key (cOper);

/*==============================================================*/
/* Index: ipk_operator                                          */
/*==============================================================*/
create unique index ipk_operator on operator (
cOper
);

/*==============================================================*/
/* Index: ifk_stuff                                             */
/*==============================================================*/
create  index ifk_stuff on operator (
cPoint
);

/*==============================================================*/
/* Index: ifk_limit                                             */
/*==============================================================*/
create  index ifk_limit on operator (
cRule
);

/*==============================================================*/
/* Table: person                                                */
/*==============================================================*/
create table person (
   pId                  UUID                 not null,
   cState               INT4                 null,
   shortName            VARCHAR(1024)        null,
   fullName             VARCHAR(1024)        null,
   legalName            VARCHAR(1024)        null,
   bornDate             DATE                 null,
   sexId                BOOL                 null
);

comment on column person.fullName is
'Полное имя человека, как он сам себя называет, записанное в латинской транскрипции.';

comment on column person.legalName is
'Полное имя человека, которое указано в официальных документах страны пребывания в латинице кодировке utf-8 до кода U+0127';

comment on column person.sexId is
'Male/female';

alter table person
   add constraint PK_PERSON primary key (pId);

/*==============================================================*/
/* Index: ipk_person                                            */
/*==============================================================*/
create unique index ipk_person on person (
pId
);

/*==============================================================*/
/* Index: ifk_heimat                                            */
/*==============================================================*/
create  index ifk_heimat on person (
cState
);

/*==============================================================*/
/* Table: photoData                                             */
/*==============================================================*/
create table photoData (
   pId                  UUID                 not null,
   cPhoto               INT4                 null,
   photo                CHAR(254)            null
);

alter table photoData
   add constraint PK_PHOTODATA primary key (pId);

/*==============================================================*/
/* Index: ifk_det                                               */
/*==============================================================*/
create  index ifk_det on photoData (
cPhoto
);

/*==============================================================*/
/* Index: ifk_imaged                                            */
/*==============================================================*/
create  index ifk_imaged on photoData (
pId
);

/*==============================================================*/
/* Table: photoSpec                                             */
/*==============================================================*/
create table photoSpec (
   cPhoto               SERIAL               not null,
   photoSpec            VARCHAR(1024)        null
);

comment on table photoSpec is
'Определяет суть фото человека - фас, профиль, отпечаток большого пальца правой руки и т.д.';

alter table photoSpec
   add constraint PK_PHOTOSPEC primary key (cPhoto);

/*==============================================================*/
/* Index: ipk_photoSpec                                         */
/*==============================================================*/
create unique index ipk_photoSpec on photoSpec (
cPhoto
);

/*==============================================================*/
/* Table: ref                                                   */
/*==============================================================*/
create table ref (
   pId                  UUID                 not null,
   per_pId              UUID                 not null,
   Memo                 TEXT                 null
);

comment on table ref is
'Определяет суть отношения между Персонами, например:
- Отождествление - если человек был зарегистрирован несколько раз;
- Референсе на человека, подтвердившего идентификацию (например),
- .. ';

alter table ref
   add constraint PK_REF primary key (pId, per_pId);

/*==============================================================*/
/* Index: ifk_subj                                              */
/*==============================================================*/
create  index ifk_subj on ref (
per_pId
);

/*==============================================================*/
/* Index: ifk_obj                                               */
/*==============================================================*/
create  index ifk_obj on ref (
pId
);

/*==============================================================*/
/* Table: regPoint                                              */
/*==============================================================*/
create table regPoint (
   cPoint               SERIAL               not null,
   cState               INT4                 null,
   point                VARCHAR(1024)        null,
   point_en             VARCHAR(1024)        null,
   location             VARCHAR(1024)        null,
   location_en          VARCHAR(1024)        null
);

alter table regPoint
   add constraint PK_REGPOINT primary key (cPoint);

/*==============================================================*/
/* Index: ipk_regPoint                                          */
/*==============================================================*/
create unique index ipk_regPoint on regPoint (
cPoint
);

/*==============================================================*/
/* Index: ifk_нахождение                                        */
/*==============================================================*/
create  index ifk_нахождение on regPoint (
cState
);

alter table Contact
   add constraint FK_CONTACT_DETS_AGENT foreign key (cAgent)
      references Agent (cAgent)
      on delete restrict on update restrict;

alter table Contact
   add constraint FK_CONTACT_HAVE_PERSON foreign key (pId)
      references person (pId)
      on delete restrict on update restrict;

alter table access
   add constraint FK_ACCESS_DETBY_OPERATOR foreign key (cOper)
      references operator (cOper)
      on delete restrict on update restrict;

alter table access
   add constraint FK_ACCESS_GET_PERSON foreign key (pId)
      references person (pId)
      on delete restrict on update restrict;

alter table audioDatа
   add constraint FK_AUDIODAT_VOICE_PERSON foreign key (pId)
      references person (pId)
      on delete restrict on update restrict;

alter table doc
   add constraint FK_DOC_RELATIONS_DOCSPEC foreign key (cSpec)
      references docSpec (cSpec)
      on delete restrict on update restrict;

alter table doc
   add constraint FK_DOC_DOCSTATE_STATE foreign key (cState)
      references State (cState)
      on delete restrict on update restrict;

alter table doc
   add constraint FK_DOC_OWNER_PERSON foreign key (pId)
      references person (pId)
      on delete restrict on update restrict;

alter table docImage
   add constraint FK_DOCIMAGE_PICS_DOC foreign key (cDoc)
      references doc (cDoc)
      on delete restrict on update restrict;

alter table operator
   add constraint FK_OPERATOR_LIMIT_OPRULE foreign key (cRule)
      references opRule (cRule)
      on delete restrict on update restrict;

alter table operator
   add constraint FK_OPERATOR_STUFF_REGPOINT foreign key (cPoint)
      references regPoint (cPoint)
      on delete restrict on update restrict;

alter table person
   add constraint FK_PERSON_HEIMAT_STATE foreign key (cState)
      references State (cState)
      on delete restrict on update restrict;

alter table photoData
   add constraint FK_PHOTODAT_DET_PHOTOSPE foreign key (cPhoto)
      references photoSpec (cPhoto)
      on delete restrict on update restrict;

alter table photoData
   add constraint FK_PHOTODAT_IMAGED_PERSON foreign key (pId)
      references person (pId)
      on delete restrict on update restrict;

alter table ref
   add constraint FK_REF_OBJ_PERSON foreign key (pId)
      references person (pId)
      on delete restrict on update restrict;

alter table ref
   add constraint FK_REF_SUBJ_PERSON foreign key (per_pId)
      references person (pId)
      on delete restrict on update restrict;

alter table regPoint
   add constraint FK_REGPOINT_LANDPLACI_STATE foreign key (cState)
      references State (cState)
      on delete restrict on update restrict;

