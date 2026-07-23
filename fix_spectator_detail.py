with open("frontend/src/pages/ConnectedPages.tsx", "r") as f:
    content = f.read()

target = """    const semiFinalRaces = races
      .filter((race) => (race.roundNumber || 1) === 2)
      .map((race, index) => ({
        date: formatDateTime(race.raceDate),
        title: race.name,
        status:
          race.status === 'ONGOING'
            ? 'live'
            : race.status === 'COMPLETED' || race.status === 'FINISHED'
              ? 'completed'
              ? 'completed'
              : 'upcoming',
      })),
    };
  }, [slug]);"""

replacement = """    const semiFinalRaces = races
      .filter((race) => (race.roundNumber || 1) === 2)
      .map((race, index) => ({
        date: formatDateTime(race.raceDate),
        title: race.name,
        status:
          race.status === 'ONGOING'
            ? 'live'
            : race.status === 'COMPLETED' || race.status === 'FINISHED'
              ? 'completed'
              : 'upcoming',
        chip: String(index + 1),
        entry: `${formatDateTime(race.raceDate)} - ${race.distanceM || 0}M`,
      }));

    const finalRaceData = races.find((race) => (race.roundNumber || 1) === 3);
    const finalRace = finalRaceData ? {
      title: finalRaceData.name,
      slug: slugify(finalRaceData.name),
      dateStr: formatDateTime(finalRaceData.raceDate),
      distance: `${finalRaceData.distanceM || 0}m`,
      status: finalRaceData.status === 'ONGOING' ? 'LIVE' : finalRaceData.status === 'COMPLETED' || finalRaceData.status === 'FINISHED' ? 'COMPLETED' : 'SCHEDULED',
      participants: finalRaceData.maxParticipants || 0,
      referee: finalRaceData.refereeName || 'TBA',
    } : undefined;

    return {
      data: {
        location: tournament.location,
        dates: formatDateRange(tournament.startDate, tournament.endDate),
        heroUrl: tournament.imageUrl || '',
      },
      qualifyingRaces,
      semiFinalRaces,
      finalRace,
      schedule: races.map((race) => ({
        time: formatDateTime(race.raceDate),
        event: race.name,
        status:
          race.status === 'ONGOING'
            ? 'live'
            : race.status === 'COMPLETED' || race.status === 'FINISHED'
              ? 'completed'
              : 'upcoming',
        link: spectatorTournamentPath(slugify(tournament.name)),
      })),
    };
  }, [slug]);"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced target 1")

target2 = """      semiFinalRaces={data?.semiFinalRaces}
      schedule={data?.schedule}"""

replacement2 = """      semiFinalRaces={data?.semiFinalRaces}
      finalRace={data?.finalRace}
      schedule={data?.schedule}"""

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Replaced target 2")

with open("frontend/src/pages/ConnectedPages.tsx", "w") as f:
    f.write(content)
