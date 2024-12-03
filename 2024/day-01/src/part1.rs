#[tracing::instrument]
pub fn process(input: &str) -> miette::Result<String> {
    let mut left = vec![];
    let mut right = vec![];
    for line in input.lines() {
        let mut lids = line.split_whitespace();
        left.push(lids.next().unwrap().parse::<i32>().unwrap());
        right.push(lids.next().unwrap().parse::<i32>().unwrap());
    }
    left.sort();
    right.sort();
    let total_distance: i32 = std::iter::zip(left, right)
        .map(|(l, r)| (l - r).abs())
        .sum();
    dbg!(total_distance);
    return Ok(total_distance.to_string());
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
        assert_eq!("11", process(input)?);
        Ok(())
    }
}
