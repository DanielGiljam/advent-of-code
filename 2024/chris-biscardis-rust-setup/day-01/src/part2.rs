#[tracing::instrument]
pub fn process(input: &str) -> miette::Result<String> {
    let mut left = vec![];
    let mut right = vec![];
    for line in input.lines() {
        let mut lids = line.split_whitespace();
        left.push(lids.next().unwrap().parse::<usize>().unwrap());
        right.push(lids.next().unwrap().parse::<usize>().unwrap());
    }
    let similarity_score: usize = left
        .iter()
        .map(|l| l * right.iter().filter(|r| r == &l).count())
        .sum();
    dbg!(similarity_score);
    return Ok(similarity_score.to_string());
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "3   4
                           4   3
                           2   5
                           1   3
                           3   9
                           3   3";
        assert_eq!("31", process(input)?);
        Ok(())
    }
}
