// God's Commands in Light of Eternity — theme data
//
// emphasis: 1 = stated, 2 = repeated, 3 = pressed again and again across Scripture
// category: center | hub | pursue | avoid | kingdom | eternity
//
// label / sublabel / summary hold one string per interface language ('en', 'ar').
// verses[].ref is the English reference; Arabic references are generated at render
// time from AR_BOOKS in i18n.js, so a reference is never transcribed twice.
// verses[].text is keyed by TRANSLATION id ('esv', 'keh', 'svd'). A translation with
// no entry falls back to ESV in the panel and is labelled as such — never invent
// Scripture text here; paste it from the published translation.

const THEMES = [
  {
    "id": "gospel",
    "label": {
      "en": "Believe in Jesus",
      "ar": "الإيمان بيسوع"
    },
    "sublabel": {
      "en": "Saved by grace through faith",
      "ar": "الخلاص بالنعمة بالإيمان"
    },
    "category": "center",
    "emphasis": 3,
    "summary": {
      "en": "The entrance to salvation and to everything else on this map: receiving the forgiveness of Jesus through His death and resurrection, believing in Him, and being saved by grace through faith — not by works. Every other command flows out of this new life, never as a way to earn it.",
      "ar": "المدخل إلى الخلاص وإلى كل ما في هذه الخريطة: قبول غفران يسوع بموته وقيامته، والإيمان به، والخلاص بالنعمة بالإيمان لا بالأعمال. وكل وصية أخرى هنا تنبع من هذه الحياة الجديدة، وليست وسيلة لاستحقاقها."
    },
    "verses": [
      {
        "ref": "John 3:16",
        "text": {
          "esv": "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."
        }
      },
      {
        "ref": "Ephesians 2:8–9",
        "text": {
          "esv": "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast."
        }
      },
      {
        "ref": "Romans 10:9",
        "text": {
          "esv": "If you confess with your mouth that Jesus is Lord and believe in your heart that God raised him from the dead, you will be saved."
        }
      },
      {
        "ref": "John 14:6",
        "text": {
          "esv": "I am the way, and the truth, and the life. No one comes to the Father except through me."
        }
      },
      {
        "ref": "Acts 4:12",
        "text": {
          "esv": "And there is salvation in no one else, for there is no other name under heaven given among men by which we must be saved."
        }
      },
      {
        "ref": "1 Corinthians 15:3–4",
        "text": {
          "esv": "Christ died for our sins in accordance with the Scriptures... he was buried... he was raised on the third day in accordance with the Scriptures."
        }
      }
    ]
  },
  {
    "id": "kingdom-hub",
    "label": {
      "en": "Entering the Kingdom",
      "ar": "الدخول إلى الملكوت"
    },
    "category": "hub",
    "parent": "gospel",
    "emphasis": 3,
    "summary": {
      "en": "What Jesus says about who enters the kingdom of heaven. These are not suggestions — they describe the life of genuine, saving faith.",
      "ar": "ما قاله يسوع عمَّن يدخل ملكوت السماوات. هذه ليست اقتراحات، بل هي وصف لحياة الإيمان الحقيقي المُخلِّص."
    },
    "verses": [
      {
        "ref": "Matthew 7:21",
        "text": {
          "esv": "Not everyone who says to me, \"Lord, Lord,\" will enter the kingdom of heaven, but the one who does the will of my Father who is in heaven."
        }
      }
    ]
  },
  {
    "id": "pursue-hub",
    "label": {
      "en": "Pursue & Grow In",
      "ar": "السعي والنمو"
    },
    "category": "hub",
    "parent": "gospel",
    "emphasis": 3,
    "summary": {
      "en": "What God repeatedly commands His people to pursue, practice, and grow in as those who believe in Jesus.",
      "ar": "ما يأمر الله شعبه مرارًا أن يسعوا إليه ويمارسوه وينموا فيه، كمؤمنين بيسوع."
    },
    "verses": [
      {
        "ref": "2 Peter 1:5–8",
        "text": {
          "esv": "Make every effort to supplement your faith with virtue, and virtue with knowledge... For if these qualities are yours and are increasing, they keep you from being ineffective or unfruitful in the knowledge of our Lord Jesus Christ."
        }
      }
    ]
  },
  {
    "id": "avoid-hub",
    "label": {
      "en": "Avoid & Put to Death",
      "ar": "التجنُّب والإماتة"
    },
    "category": "hub",
    "parent": "gospel",
    "emphasis": 3,
    "summary": {
      "en": "What God repeatedly warns His people to flee, avoid, and put to death — warnings given in light of eternity.",
      "ar": "ما يحذِّر الله شعبه مرارًا أن يهربوا منه ويتجنبوه ويميتوه — تحذيرات مُعطاة في ضوء الأبدية."
    },
    "verses": [
      {
        "ref": "Colossians 3:5–6",
        "text": {
          "esv": "Put to death therefore what is earthly in you: sexual immorality, impurity, passion, evil desire, and covetousness, which is idolatry. On account of these the wrath of God is coming."
        }
      }
    ]
  },
  {
    "id": "eternity-hub",
    "label": {
      "en": "In Light of Eternity",
      "ar": "في ضوء الأبدية"
    },
    "category": "hub",
    "parent": "gospel",
    "emphasis": 3,
    "summary": {
      "en": "Why the severity: every person will stand before God. Jesus speaks of heaven and hell, judgment and reward, more directly than anyone in Scripture.",
      "ar": "لماذا هذه الجدية: كل إنسان سيقف أمام الله. ويسوع يتكلم عن السماء وجهنم، والدينونة والمكافأة، أكثر من أي أحد في الكتاب المقدس."
    },
    "verses": [
      {
        "ref": "2 Corinthians 5:10",
        "text": {
          "esv": "For we must all appear before the judgment seat of Christ, so that each one may receive what is due for what he has done in the body, whether good or evil."
        }
      }
    ]
  },
  {
    "id": "born-again",
    "label": {
      "en": "Be born again",
      "ar": "الولادة الجديدة"
    },
    "category": "kingdom",
    "parent": "kingdom-hub",
    "emphasis": 2,
    "summary": {
      "en": "Jesus says entry into the kingdom requires new birth from God — not self-improvement.",
      "ar": "يقول يسوع إن الدخول إلى الملكوت يتطلب ولادة جديدة من الله، لا مجرد إصلاح للذات."
    },
    "verses": [
      {
        "ref": "John 3:3",
        "text": {
          "esv": "Truly, truly, I say to you, unless one is born again he cannot see the kingdom of God."
        }
      },
      {
        "ref": "John 3:5",
        "text": {
          "esv": "Unless one is born of water and the Spirit, he cannot enter the kingdom of God."
        }
      },
      {
        "ref": "1 Peter 1:3",
        "text": {
          "esv": "He has caused us to be born again to a living hope through the resurrection of Jesus Christ from the dead."
        }
      }
    ]
  },
  {
    "id": "like-children",
    "label": {
      "en": "Become like children",
      "ar": "صيروا مثل الأطفال"
    },
    "category": "kingdom",
    "parent": "kingdom-hub",
    "emphasis": 2,
    "summary": {
      "en": "Humble, dependent trust — the posture Jesus requires for entering the kingdom.",
      "ar": "ثقة متضعة معتمِدة على الله — الموقف الذي يطلبه يسوع للدخول إلى الملكوت."
    },
    "verses": [
      {
        "ref": "Matthew 18:3",
        "text": {
          "esv": "Truly, I say to you, unless you turn and become like children, you will never enter the kingdom of heaven."
        }
      },
      {
        "ref": "Mark 10:15",
        "text": {
          "esv": "Whoever does not receive the kingdom of God like a child shall not enter it."
        }
      }
    ]
  },
  {
    "id": "narrow-gate",
    "label": {
      "en": "Enter the narrow gate",
      "ar": "الباب الضيق"
    },
    "category": "kingdom",
    "parent": "kingdom-hub",
    "emphasis": 2,
    "summary": {
      "en": "Jesus warns that the way to life is narrow and few find it — He commands us to enter it.",
      "ar": "يحذِّر يسوع أن الطريق إلى الحياة ضيق وقليلون هم الذين يجدونه، ويأمرنا أن ندخل منه."
    },
    "verses": [
      {
        "ref": "Matthew 7:13–14",
        "text": {
          "esv": "Enter by the narrow gate... the gate is narrow and the way is hard that leads to life, and those who find it are few."
        }
      },
      {
        "ref": "Luke 13:24",
        "text": {
          "esv": "Strive to enter through the narrow door. For many, I tell you, will seek to enter and will not be able."
        }
      }
    ]
  },
  {
    "id": "do-the-will",
    "label": {
      "en": "Do the Father’s will",
      "ar": "عمل مشيئة الآب"
    },
    "category": "kingdom",
    "parent": "kingdom-hub",
    "emphasis": 3,
    "summary": {
      "en": "Saying \"Lord, Lord\" is not enough; genuine faith does the will of the Father.",
      "ar": "لا يكفي أن نقول «يا رب، يا رب»؛ فالإيمان الحقيقي يعمل مشيئة الآب."
    },
    "verses": [
      {
        "ref": "Matthew 7:21",
        "text": {
          "esv": "Not everyone who says to me, \"Lord, Lord,\" will enter the kingdom of heaven, but the one who does the will of my Father who is in heaven."
        }
      },
      {
        "ref": "James 1:22",
        "text": {
          "esv": "But be doers of the word, and not hearers only, deceiving yourselves."
        }
      },
      {
        "ref": "1 John 2:17",
        "text": {
          "esv": "The world is passing away along with its desires, but whoever does the will of God abides forever."
        }
      }
    ]
  },
  {
    "id": "endure",
    "label": {
      "en": "Endure to the end",
      "ar": "الثبات إلى النهاية"
    },
    "category": "kingdom",
    "parent": "kingdom-hub",
    "emphasis": 2,
    "summary": {
      "en": "Jesus and the apostles call believers to persevere in faith to the end.",
      "ar": "يدعو يسوع والرسل المؤمنين إلى الثبات في الإيمان حتى النهاية."
    },
    "verses": [
      {
        "ref": "Matthew 24:13",
        "text": {
          "esv": "But the one who endures to the end will be saved."
        }
      },
      {
        "ref": "Hebrews 3:14",
        "text": {
          "esv": "For we have come to share in Christ, if indeed we hold our original confidence firm to the end."
        }
      },
      {
        "ref": "Revelation 2:10",
        "text": {
          "esv": "Be faithful unto death, and I will give you the crown of life."
        }
      }
    ]
  },
  {
    "id": "love-god",
    "label": {
      "en": "Love God wholly",
      "ar": "محبة الله بالكامل"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 3,
    "summary": {
      "en": "The greatest commandment, given in the Law and confirmed by Jesus.",
      "ar": "الوصية العظمى، المُعطاة في الناموس والمؤكَّدة من يسوع."
    },
    "verses": [
      {
        "ref": "Deuteronomy 6:5",
        "text": {
          "esv": "You shall love the LORD your God with all your heart and with all your soul and with all your might."
        }
      },
      {
        "ref": "Matthew 22:37–38",
        "text": {
          "esv": "You shall love the Lord your God with all your heart and with all your soul and with all your mind. This is the great and first commandment."
        }
      },
      {
        "ref": "John 14:15",
        "text": {
          "esv": "If you love me, you will keep my commandments."
        }
      }
    ]
  },
  {
    "id": "love-others",
    "label": {
      "en": "Love one another",
      "ar": "محبة بعضنا بعضًا"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 3,
    "summary": {
      "en": "Commanded in the Law, called the second great commandment by Jesus, made His \"new commandment,\" and repeated throughout the epistles more than almost anything else.",
      "ar": "أُمِر بها في الناموس، ودعاها يسوع الوصية الثانية العظمى، وجعلها وصيته الجديدة، وتتكرر في الرسائل أكثر من أي شيء آخر تقريبًا."
    },
    "verses": [
      {
        "ref": "Leviticus 19:18",
        "text": {
          "esv": "You shall love your neighbor as yourself: I am the LORD."
        }
      },
      {
        "ref": "John 13:34–35",
        "text": {
          "esv": "A new commandment I give to you, that you love one another: just as I have loved you... By this all people will know that you are my disciples."
        }
      },
      {
        "ref": "Romans 13:8",
        "text": {
          "esv": "Owe no one anything, except to love each other, for the one who loves another has fulfilled the law."
        }
      },
      {
        "ref": "1 John 4:20",
        "text": {
          "esv": "If anyone says, \"I love God,\" and hates his brother, he is a liar."
        }
      },
      {
        "ref": "Matthew 5:44",
        "text": {
          "esv": "Love your enemies and pray for those who persecute you."
        }
      }
    ]
  },
  {
    "id": "repent",
    "label": {
      "en": "Repent",
      "ar": "التوبة"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 3,
    "summary": {
      "en": "The first word of Jesus’ preaching, and God’s command to all people everywhere.",
      "ar": "أول كلمة في كرازة يسوع، ووصية الله لجميع الناس في كل مكان."
    },
    "verses": [
      {
        "ref": "Matthew 4:17",
        "text": {
          "esv": "Repent, for the kingdom of heaven is at hand."
        }
      },
      {
        "ref": "Luke 13:3",
        "text": {
          "esv": "Unless you repent, you will all likewise perish."
        }
      },
      {
        "ref": "Acts 17:30",
        "text": {
          "esv": "The times of ignorance God overlooked, but now he commands all people everywhere to repent."
        }
      }
    ]
  },
  {
    "id": "forgive",
    "label": {
      "en": "Forgive others",
      "ar": "مغفرة الآخرين"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 3,
    "summary": {
      "en": "Jesus ties our forgiveness of others directly to the Father’s forgiveness of us — with sobering severity.",
      "ar": "يربط يسوع مغفرتنا للآخرين مباشرةً بمغفرة الآب لنا — بجدية مَهيبة."
    },
    "verses": [
      {
        "ref": "Matthew 6:14–15",
        "text": {
          "esv": "If you forgive others their trespasses, your heavenly Father will also forgive you, but if you do not forgive others... neither will your Father forgive your trespasses."
        }
      },
      {
        "ref": "Matthew 18:21–22",
        "text": {
          "esv": "I do not say to you seven times, but seventy-seven times."
        }
      },
      {
        "ref": "Ephesians 4:32",
        "text": {
          "esv": "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you."
        }
      }
    ]
  },
  {
    "id": "seek-first",
    "label": {
      "en": "Seek first the kingdom",
      "ar": "اطلبوا الملكوت أولًا"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 2,
    "summary": {
      "en": "Jesus reorders every priority around the kingdom of God and His righteousness.",
      "ar": "يعيد يسوع ترتيب كل الأولويات حول ملكوت الله وبرِّه."
    },
    "verses": [
      {
        "ref": "Matthew 6:33",
        "text": {
          "esv": "But seek first the kingdom of God and his righteousness, and all these things will be added to you."
        }
      },
      {
        "ref": "Colossians 3:1–2",
        "text": {
          "esv": "Seek the things that are above, where Christ is... Set your minds on things that are above, not on things that are on earth."
        }
      }
    ]
  },
  {
    "id": "deny-self",
    "label": {
      "en": "Deny self, take up the cross",
      "ar": "إنكار الذات وحمل الصليب"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 3,
    "summary": {
      "en": "Recorded in all three synoptic gospels: following Jesus means losing your life to find it.",
      "ar": "مذكور في الأناجيل الثلاثة: اتِّباع يسوع يعني أن نخسر حياتنا لكي نجدها."
    },
    "verses": [
      {
        "ref": "Matthew 16:24–26",
        "text": {
          "esv": "If anyone would come after me, let him deny himself and take up his cross and follow me... For what will it profit a man if he gains the whole world and forfeits his soul?"
        }
      },
      {
        "ref": "Luke 14:27",
        "text": {
          "esv": "Whoever does not bear his own cross and come after me cannot be my disciple."
        }
      },
      {
        "ref": "Galatians 2:20",
        "text": {
          "esv": "I have been crucified with Christ. It is no longer I who live, but Christ who lives in me."
        }
      }
    ]
  },
  {
    "id": "abide",
    "label": {
      "en": "Abide in Christ",
      "ar": "الثبات في المسيح"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 2,
    "summary": {
      "en": "Fruitfulness flows only from remaining in Jesus — apart from Him we can do nothing.",
      "ar": "الإثمار لا يأتي إلا بالثبات في يسوع — فبدونه لا نقدر أن نفعل شيئًا."
    },
    "verses": [
      {
        "ref": "John 15:4–5",
        "text": {
          "esv": "Abide in me, and I in you... apart from me you can do nothing."
        }
      },
      {
        "ref": "John 15:6",
        "text": {
          "esv": "If anyone does not abide in me he is thrown away like a branch and withers."
        }
      }
    ]
  },
  {
    "id": "pray",
    "label": {
      "en": "Pray always",
      "ar": "الصلاة بلا انقطاع"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 3,
    "summary": {
      "en": "Jesus taught, modeled, and commanded persistent prayer; the epistles command it without ceasing.",
      "ar": "علَّم يسوع الصلاة الدائمة وعاشها وأمر بها، والرسائل تأمر بها بلا انقطاع."
    },
    "verses": [
      {
        "ref": "Luke 18:1",
        "text": {
          "esv": "They ought always to pray and not lose heart."
        }
      },
      {
        "ref": "1 Thessalonians 5:17",
        "text": {
          "esv": "Pray without ceasing."
        }
      },
      {
        "ref": "Matthew 6:6",
        "text": {
          "esv": "But when you pray, go into your room and shut the door and pray to your Father who is in secret."
        }
      }
    ]
  },
  {
    "id": "humility",
    "label": {
      "en": "Humble yourself",
      "ar": "التواضع"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 3,
    "summary": {
      "en": "God opposes the proud but gives grace to the humble — a thread from the Law and Prophets through Jesus to the epistles.",
      "ar": "الله يقاوم المستكبرين ويعطي نعمة للمتواضعين — خيط ممتد من الناموس والأنبياء إلى يسوع والرسائل."
    },
    "verses": [
      {
        "ref": "Micah 6:8",
        "text": {
          "esv": "What does the LORD require of you but to do justice, and to love kindness, and to walk humbly with your God?"
        }
      },
      {
        "ref": "Matthew 23:12",
        "text": {
          "esv": "Whoever exalts himself will be humbled, and whoever humbles himself will be exalted."
        }
      },
      {
        "ref": "James 4:6",
        "text": {
          "esv": "God opposes the proud but gives grace to the humble."
        }
      },
      {
        "ref": "Philippians 2:3",
        "text": {
          "esv": "In humility count others more significant than yourselves."
        }
      }
    ]
  },
  {
    "id": "holiness",
    "label": {
      "en": "Pursue holiness",
      "ar": "السعي إلى القداسة"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 3,
    "summary": {
      "en": "\"Be holy, for I am holy\" spans Leviticus to 1 Peter; Hebrews ties holiness to seeing the Lord.",
      "ar": "«كونوا قديسين لأني أنا قدوس» تمتد من سفر اللاويين إلى رسالة بطرس الأولى، والعبرانيين تربط القداسة برؤية الرب."
    },
    "verses": [
      {
        "ref": "Leviticus 19:2",
        "text": {
          "esv": "You shall be holy, for I the LORD your God am holy."
        }
      },
      {
        "ref": "1 Peter 1:15–16",
        "text": {
          "esv": "As he who called you is holy, you also be holy in all your conduct, since it is written, \"You shall be holy, for I am holy.\""
        }
      },
      {
        "ref": "Hebrews 12:14",
        "text": {
          "esv": "Strive for peace with everyone, and for the holiness without which no one will see the Lord."
        }
      }
    ]
  },
  {
    "id": "fear-lord",
    "label": {
      "en": "Fear the Lord",
      "ar": "مخافة الرب"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 3,
    "summary": {
      "en": "The beginning of wisdom and the whole duty of man; Jesus tells us whom to truly fear.",
      "ar": "بداية الحكمة وغاية الإنسان كلها؛ ويسوع يعلِّمنا مَن نخاف حقًا."
    },
    "verses": [
      {
        "ref": "Proverbs 9:10",
        "text": {
          "esv": "The fear of the LORD is the beginning of wisdom."
        }
      },
      {
        "ref": "Ecclesiastes 12:13",
        "text": {
          "esv": "Fear God and keep his commandments, for this is the whole duty of man."
        }
      },
      {
        "ref": "Matthew 10:28",
        "text": {
          "esv": "Do not fear those who kill the body but cannot kill the soul. Rather fear him who can destroy both soul and body in hell."
        }
      }
    ]
  },
  {
    "id": "give-poor",
    "label": {
      "en": "Give & care for the needy",
      "ar": "العطاء ورعاية المحتاجين"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 3,
    "summary": {
      "en": "Care for the poor, the widow, the orphan, and the stranger runs through the Law, the Prophets, Jesus, and James.",
      "ar": "رعاية الفقير والأرملة واليتيم والغريب تجري في الناموس والأنبياء ويسوع ويعقوب."
    },
    "verses": [
      {
        "ref": "Proverbs 19:17",
        "text": {
          "esv": "Whoever is generous to the poor lends to the LORD, and he will repay him for his deed."
        }
      },
      {
        "ref": "Matthew 25:40",
        "text": {
          "esv": "As you did it to one of the least of these my brothers, you did it to me."
        }
      },
      {
        "ref": "James 1:27",
        "text": {
          "esv": "Religion that is pure and undefiled before God the Father is this: to visit orphans and widows in their affliction."
        }
      },
      {
        "ref": "Luke 12:33",
        "text": {
          "esv": "Sell your possessions, and give to the needy. Provide yourselves... with a treasure in the heavens that does not fail."
        }
      }
    ]
  },
  {
    "id": "make-disciples",
    "label": {
      "en": "Make disciples",
      "ar": "تلمذة الأمم"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 2,
    "summary": {
      "en": "Jesus’ final commission to His church before ascending.",
      "ar": "وصية يسوع الأخيرة لكنيسته قبل صعوده."
    },
    "verses": [
      {
        "ref": "Matthew 28:19–20",
        "text": {
          "esv": "Go therefore and make disciples of all nations, baptizing them... teaching them to observe all that I have commanded you."
        }
      },
      {
        "ref": "Acts 1:8",
        "text": {
          "esv": "You will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the earth."
        }
      }
    ]
  },
  {
    "id": "treasure-heaven",
    "label": {
      "en": "Store treasure in heaven",
      "ar": "كنوز في السماء"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 2,
    "summary": {
      "en": "Jesus commands us to invest where eternity is — for where your treasure is, there your heart will be.",
      "ar": "يأمرنا يسوع أن نستثمر حيث الأبدية — فحيث يكون كنزك يكون قلبك أيضًا."
    },
    "verses": [
      {
        "ref": "Matthew 6:19–21",
        "text": {
          "esv": "Do not lay up for yourselves treasures on earth... but lay up for yourselves treasures in heaven... For where your treasure is, there your heart will be also."
        }
      },
      {
        "ref": "1 Timothy 6:18–19",
        "text": {
          "esv": "Be rich in good works... thus storing up treasure for themselves as a good foundation for the future."
        }
      }
    ]
  },
  {
    "id": "watchful",
    "label": {
      "en": "Stay awake & be ready",
      "ar": "السهر والاستعداد"
    },
    "category": "pursue",
    "parent": "pursue-hub",
    "emphasis": 3,
    "summary": {
      "en": "Jesus repeatedly commands watchfulness for His return — in parable after parable.",
      "ar": "يأمر يسوع مرارًا بالسهر انتظارًا لمجيئه — في مثل بعد مثل."
    },
    "verses": [
      {
        "ref": "Matthew 24:42",
        "text": {
          "esv": "Therefore, stay awake, for you do not know on what day your Lord is coming."
        }
      },
      {
        "ref": "Matthew 25:13",
        "text": {
          "esv": "Watch therefore, for you know neither the day nor the hour."
        }
      },
      {
        "ref": "Luke 12:40",
        "text": {
          "esv": "You also must be ready, for the Son of Man is coming at an hour you do not expect."
        }
      }
    ]
  },
  {
    "id": "sexual-immorality",
    "label": {
      "en": "Sexual immorality",
      "ar": "الزنى والفجور"
    },
    "category": "avoid",
    "parent": "avoid-hub",
    "emphasis": 3,
    "summary": {
      "en": "One of Scripture’s most repeated warnings — with the kingdom of God explicitly at stake. Jesus extends it to lust of the heart.",
      "ar": "من أكثر تحذيرات الكتاب المقدس تكرارًا — وملكوت الله نفسه على المحك. ويمتد بها يسوع إلى شهوة القلب."
    },
    "verses": [
      {
        "ref": "1 Corinthians 6:9–10",
        "text": {
          "esv": "Do not be deceived: neither the sexually immoral, nor idolaters, nor adulterers... will inherit the kingdom of God."
        }
      },
      {
        "ref": "Ephesians 5:5",
        "text": {
          "esv": "Everyone who is sexually immoral or impure... has no inheritance in the kingdom of Christ and God."
        }
      },
      {
        "ref": "Matthew 5:28",
        "text": {
          "esv": "Everyone who looks at a woman with lustful intent has already committed adultery with her in his heart."
        }
      },
      {
        "ref": "1 Thessalonians 4:3",
        "text": {
          "esv": "For this is the will of God, your sanctification: that you abstain from sexual immorality."
        }
      },
      {
        "ref": "Hebrews 13:4",
        "text": {
          "esv": "Let marriage be held in honor among all... for God will judge the sexually immoral and adulterous."
        }
      },
      {
        "ref": "1 Corinthians 6:18",
        "text": {
          "esv": "Flee from sexual immorality."
        }
      }
    ]
  },
  {
    "id": "idolatry",
    "label": {
      "en": "Idolatry",
      "ar": "عبادة الأوثان"
    },
    "category": "avoid",
    "parent": "avoid-hub",
    "emphasis": 3,
    "summary": {
      "en": "The first commandment and the sin most confronted across the Old Testament; the New Testament names covetousness as idolatry too.",
      "ar": "الوصية الأولى، وأكثر خطية واجهها العهد القديم؛ والعهد الجديد يسمِّي الطمع أيضًا عبادة أوثان."
    },
    "verses": [
      {
        "ref": "Exodus 20:3–4",
        "text": {
          "esv": "You shall have no other gods before me. You shall not make for yourself a carved image."
        }
      },
      {
        "ref": "1 John 5:21",
        "text": {
          "esv": "Little children, keep yourselves from idols."
        }
      },
      {
        "ref": "Colossians 3:5",
        "text": {
          "esv": "...and covetousness, which is idolatry."
        }
      },
      {
        "ref": "1 Corinthians 10:14",
        "text": {
          "esv": "Therefore, my beloved, flee from idolatry."
        }
      }
    ]
  },
  {
    "id": "love-of-money",
    "label": {
      "en": "Love of money & greed",
      "ar": "محبة المال والطمع"
    },
    "category": "avoid",
    "parent": "avoid-hub",
    "emphasis": 3,
    "summary": {
      "en": "Jesus speaks about money and possessions constantly: you cannot serve both God and money.",
      "ar": "يتكلم يسوع عن المال والمقتنيات باستمرار: لا تقدرون أن تخدموا الله والمال."
    },
    "verses": [
      {
        "ref": "Matthew 6:24",
        "text": {
          "esv": "No one can serve two masters... You cannot serve God and money."
        }
      },
      {
        "ref": "Luke 12:15",
        "text": {
          "esv": "Take care, and be on your guard against all covetousness, for one’s life does not consist in the abundance of his possessions."
        }
      },
      {
        "ref": "1 Timothy 6:10",
        "text": {
          "esv": "For the love of money is a root of all kinds of evils."
        }
      },
      {
        "ref": "Hebrews 13:5",
        "text": {
          "esv": "Keep your life free from love of money, and be content with what you have."
        }
      }
    ]
  },
  {
    "id": "unforgiveness",
    "label": {
      "en": "Unforgiveness",
      "ar": "عدم المغفرة"
    },
    "category": "avoid",
    "parent": "avoid-hub",
    "emphasis": 3,
    "summary": {
      "en": "Jesus warns that refusing to forgive from the heart forfeits the Father’s forgiveness.",
      "ar": "يحذِّر يسوع أن رفض المغفرة من القلب يُفقِد الإنسان مغفرة الآب."
    },
    "verses": [
      {
        "ref": "Matthew 6:15",
        "text": {
          "esv": "But if you do not forgive others their trespasses, neither will your Father forgive your trespasses."
        }
      },
      {
        "ref": "Matthew 18:34–35",
        "text": {
          "esv": "...delivered him to the jailers... So also my heavenly Father will do to every one of you, if you do not forgive your brother from your heart."
        }
      }
    ]
  },
  {
    "id": "hypocrisy",
    "label": {
      "en": "Hypocrisy",
      "ar": "الرياء"
    },
    "category": "avoid",
    "parent": "avoid-hub",
    "emphasis": 3,
    "summary": {
      "en": "The sin Jesus denounced most fiercely — seven woes against religious pretense in Matthew 23 alone.",
      "ar": "الخطية التي شجبها يسوع بأشد لهجة — سبعة ويلات على التظاهر الديني في متى ٢٣ وحدها."
    },
    "verses": [
      {
        "ref": "Matthew 23:27–28",
        "text": {
          "esv": "Woe to you, scribes and Pharisees, hypocrites! For you are like whitewashed tombs... full of hypocrisy and lawlessness."
        }
      },
      {
        "ref": "Matthew 6:1",
        "text": {
          "esv": "Beware of practicing your righteousness before other people in order to be seen by them."
        }
      },
      {
        "ref": "Luke 12:1",
        "text": {
          "esv": "Beware of the leaven of the Pharisees, which is hypocrisy."
        }
      }
    ]
  },
  {
    "id": "anger-hatred",
    "label": {
      "en": "Anger, hatred & malice",
      "ar": "الغضب والبغضة والحقد"
    },
    "category": "avoid",
    "parent": "avoid-hub",
    "emphasis": 3,
    "summary": {
      "en": "Jesus traces murder back to anger in the heart; John says hatred of a brother is incompatible with eternal life.",
      "ar": "يردُّ يسوع القتل إلى الغضب في القلب، ويوحنا يقول إن بغضة الأخ لا تجتمع مع الحياة الأبدية."
    },
    "verses": [
      {
        "ref": "Matthew 5:22",
        "text": {
          "esv": "Everyone who is angry with his brother will be liable to judgment."
        }
      },
      {
        "ref": "1 John 3:15",
        "text": {
          "esv": "Everyone who hates his brother is a murderer, and you know that no murderer has eternal life abiding in him."
        }
      },
      {
        "ref": "Ephesians 4:31",
        "text": {
          "esv": "Let all bitterness and wrath and anger and clamor and slander be put away from you, along with all malice."
        }
      }
    ]
  },
  {
    "id": "lying",
    "label": {
      "en": "Lying & deceit",
      "ar": "الكذب والخداع"
    },
    "category": "avoid",
    "parent": "avoid-hub",
    "emphasis": 3,
    "summary": {
      "en": "From the ninth commandment to Revelation’s final warnings, God hates lying lips.",
      "ar": "من الوصية التاسعة إلى تحذيرات سفر الرؤيا الأخيرة، الله يبغض شفاه الكذب."
    },
    "verses": [
      {
        "ref": "Exodus 20:16",
        "text": {
          "esv": "You shall not bear false witness against your neighbor."
        }
      },
      {
        "ref": "Proverbs 12:22",
        "text": {
          "esv": "Lying lips are an abomination to the LORD, but those who act faithfully are his delight."
        }
      },
      {
        "ref": "Revelation 21:8",
        "text": {
          "esv": "...and all liars, their portion will be in the lake that burns with fire and sulfur, which is the second death."
        }
      },
      {
        "ref": "Colossians 3:9",
        "text": {
          "esv": "Do not lie to one another, seeing that you have put off the old self with its practices."
        }
      }
    ]
  },
  {
    "id": "pride",
    "label": {
      "en": "Pride",
      "ar": "الكبرياء"
    },
    "category": "avoid",
    "parent": "avoid-hub",
    "emphasis": 3,
    "summary": {
      "en": "Pride goes before destruction; God actively opposes the proud.",
      "ar": "الكبرياء يسبق الهلاك، والله يقاوم المستكبرين."
    },
    "verses": [
      {
        "ref": "Proverbs 16:18",
        "text": {
          "esv": "Pride goes before destruction, and a haughty spirit before a fall."
        }
      },
      {
        "ref": "Proverbs 6:16–17",
        "text": {
          "esv": "There are six things that the LORD hates... haughty eyes, a lying tongue..."
        }
      },
      {
        "ref": "1 Peter 5:5",
        "text": {
          "esv": "God opposes the proud but gives grace to the humble."
        }
      }
    ]
  },
  {
    "id": "drunkenness",
    "label": {
      "en": "Drunkenness",
      "ar": "السُّكْر"
    },
    "category": "avoid",
    "parent": "avoid-hub",
    "emphasis": 2,
    "summary": {
      "en": "Listed among the works of the flesh that keep one from inheriting the kingdom.",
      "ar": "مذكور بين أعمال الجسد التي تمنع من وراثة الملكوت."
    },
    "verses": [
      {
        "ref": "Galatians 5:19–21",
        "text": {
          "esv": "Now the works of the flesh are evident... drunkenness, orgies, and things like these... those who do such things will not inherit the kingdom of God."
        }
      },
      {
        "ref": "Ephesians 5:18",
        "text": {
          "esv": "And do not get drunk with wine, for that is debauchery, but be filled with the Spirit."
        }
      }
    ]
  },
  {
    "id": "anxiety-worldliness",
    "label": {
      "en": "Anxiety & love of the world",
      "ar": "القلق ومحبة العالم"
    },
    "category": "avoid",
    "parent": "avoid-hub",
    "emphasis": 3,
    "summary": {
      "en": "Jesus commands \"do not be anxious\" repeatedly; John warns against loving a world that is passing away.",
      "ar": "يأمر يسوع مرارًا «لا تهتموا»، ويوحنا يحذِّر من محبة عالم يزول."
    },
    "verses": [
      {
        "ref": "Matthew 6:25",
        "text": {
          "esv": "Therefore I tell you, do not be anxious about your life..."
        }
      },
      {
        "ref": "1 John 2:15–17",
        "text": {
          "esv": "Do not love the world or the things in the world... the world is passing away along with its desires, but whoever does the will of God abides forever."
        }
      },
      {
        "ref": "Philippians 4:6",
        "text": {
          "esv": "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God."
        }
      }
    ]
  },
  {
    "id": "stumbling",
    "label": {
      "en": "Causing others to stumble",
      "ar": "إعثار الآخرين"
    },
    "category": "avoid",
    "parent": "avoid-hub",
    "emphasis": 2,
    "summary": {
      "en": "Jesus uses some of His most severe language for those who lead little ones into sin.",
      "ar": "يستخدم يسوع أشد كلماته على من يُعثِر الصغار."
    },
    "verses": [
      {
        "ref": "Matthew 18:6",
        "text": {
          "esv": "Whoever causes one of these little ones who believe in me to sin, it would be better for him to have a great millstone fastened around his neck and to be drowned in the depth of the sea."
        }
      },
      {
        "ref": "Romans 14:13",
        "text": {
          "esv": "Decide never to put a stumbling block or hindrance in the way of a brother."
        }
      }
    ]
  },
  {
    "id": "judging",
    "label": {
      "en": "Hypocritical judging",
      "ar": "الدينونة بالرياء"
    },
    "category": "avoid",
    "parent": "avoid-hub",
    "emphasis": 2,
    "summary": {
      "en": "Jesus warns that the measure we use will be measured back to us.",
      "ar": "يحذِّر يسوع أن الكيل الذي نكيل به يُكال لنا."
    },
    "verses": [
      {
        "ref": "Matthew 7:1–2",
        "text": {
          "esv": "Judge not, that you be not judged. For with the judgment you pronounce you will be judged."
        }
      },
      {
        "ref": "James 4:12",
        "text": {
          "esv": "There is only one lawgiver and judge, he who is able to save and to destroy. But who are you to judge your neighbor?"
        }
      }
    ]
  },
  {
    "id": "judgment",
    "label": {
      "en": "The judgment seat",
      "ar": "كرسي الدينونة"
    },
    "category": "eternity",
    "parent": "eternity-hub",
    "emphasis": 3,
    "summary": {
      "en": "Every person will give an account to God — believers for reward, all humanity before the throne.",
      "ar": "كل إنسان سيعطي حسابًا لله — المؤمنون للمكافأة، والبشرية كلها أمام العرش."
    },
    "verses": [
      {
        "ref": "Hebrews 9:27",
        "text": {
          "esv": "It is appointed for man to die once, and after that comes judgment."
        }
      },
      {
        "ref": "Romans 14:12",
        "text": {
          "esv": "So then each of us will give an account of himself to God."
        }
      },
      {
        "ref": "Revelation 20:12",
        "text": {
          "esv": "And I saw the dead, great and small, standing before the throne, and books were opened."
        }
      }
    ]
  },
  {
    "id": "heaven-hell",
    "label": {
      "en": "Heaven & hell are real",
      "ar": "السماء وجهنم حقيقيتان"
    },
    "category": "eternity",
    "parent": "eternity-hub",
    "emphasis": 3,
    "summary": {
      "en": "Jesus speaks of eternal life and eternal punishment in the same breath — the stakes behind every command.",
      "ar": "يتكلم يسوع عن الحياة الأبدية والعقاب الأبدي في نَفَسٍ واحد — وهذا هو الرهان وراء كل وصية."
    },
    "verses": [
      {
        "ref": "Matthew 25:46",
        "text": {
          "esv": "And these will go away into eternal punishment, but the righteous into eternal life."
        }
      },
      {
        "ref": "John 5:28–29",
        "text": {
          "esv": "All who are in the tombs will hear his voice and come out, those who have done good to the resurrection of life, and those who have done evil to the resurrection of judgment."
        }
      },
      {
        "ref": "Revelation 21:3–4",
        "text": {
          "esv": "He will dwell with them... He will wipe away every tear from their eyes, and death shall be no more."
        }
      }
    ]
  },
  {
    "id": "reward",
    "label": {
      "en": "Eternal reward",
      "ar": "المكافأة الأبدية"
    },
    "category": "eternity",
    "parent": "eternity-hub",
    "emphasis": 3,
    "summary": {
      "en": "Jesus constantly motivates obedience with reward from the Father — great is your reward in heaven.",
      "ar": "يحفِّز يسوع الطاعة دائمًا بالمكافأة من الآب — «أجركم عظيم في السماوات»."
    },
    "verses": [
      {
        "ref": "Matthew 5:11–12",
        "text": {
          "esv": "Blessed are you when others revile you... Rejoice and be glad, for your reward is great in heaven."
        }
      },
      {
        "ref": "Matthew 6:4",
        "text": {
          "esv": "And your Father who sees in secret will reward you."
        }
      },
      {
        "ref": "1 Corinthians 3:13–14",
        "text": {
          "esv": "Each one’s work will become manifest... If the work that anyone has built on the foundation survives, he will receive a reward."
        }
      },
      {
        "ref": "Revelation 22:12",
        "text": {
          "esv": "Behold, I am coming soon, bringing my recompense with me, to repay each one for what he has done."
        }
      }
    ]
  },
  {
    "id": "return",
    "label": {
      "en": "Jesus is coming back",
      "ar": "المسيح آتٍ ثانية"
    },
    "category": "eternity",
    "parent": "eternity-hub",
    "emphasis": 3,
    "summary": {
      "en": "The blessed hope that gives urgency to everything on this map.",
      "ar": "الرجاء المبارك الذي يعطي إلحاحًا لكل ما في هذه الخريطة."
    },
    "verses": [
      {
        "ref": "Acts 1:11",
        "text": {
          "esv": "This Jesus... will come in the same way as you saw him go into heaven."
        }
      },
      {
        "ref": "Titus 2:12–13",
        "text": {
          "esv": "...live self-controlled, upright, and godly lives in the present age, waiting for our blessed hope, the appearing of the glory of our great God and Savior Jesus Christ."
        }
      },
      {
        "ref": "2 Peter 3:11",
        "text": {
          "esv": "Since all these things are thus to be dissolved, what sort of people ought you to be in lives of holiness and godliness."
        }
      }
    ]
  }
];
